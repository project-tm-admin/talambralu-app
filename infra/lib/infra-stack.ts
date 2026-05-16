import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as iam from 'aws-cdk-lib/aws-iam';

export class InfraStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly cluster: ecs.Cluster;
  public readonly fargateService: ecs_patterns.ApplicationLoadBalancedFargateService;
  public readonly database: rds.DatabaseInstance; // Changed from DatabaseCluster
  public readonly mediaBucket: s3.Bucket;
  public readonly selfieQueue: sqs.Queue;
  public readonly incomeQueue: sqs.Queue;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Task 2: Create a new VPC
    this.vpc = new ec2.Vpc(this, 'TalambraluVpc', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'application',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'rds',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        }
      ]
    });

    // Task 3: ECS Fargate Cluster & ALB
    this.cluster = new ecs.Cluster(this, 'TalambraluCluster', {
      vpc: this.vpc,
      clusterName: 'Talambralu-Production-Cluster'
    });

    this.fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'TalambraluFargateService', {
      cluster: this.cluster,
      memoryLimitMiB: 512,
      cpu: 256,
      taskImageOptions: {
        // Placeholder image until NestJS app is ready
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        containerPort: 80,
      },
      publicLoadBalancer: true,
      taskSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
      }
    });

    // Task 4: RDS PostgreSQL (Downgraded to Free Tier t3.micro for dev)
    this.database = new rds.DatabaseInstance(this, 'TalambraluDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO), // Free Tier eligible
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      databaseName: 'talambralu',
      allocatedStorage: 20, // 20GB Free Tier
      maxAllocatedStorage: 25,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For dev only - change to RETAIN in prod
      deletionProtection: false, // For dev only
    });

    // Allow Fargate to connect to RDS
    this.database.connections.allowDefaultPortFrom(this.fargateService.service.connections);

    // Task 5: S3 Storage Bucket with 14-day deletion lifecycle for verification docs
    this.mediaBucket = new s3.Bucket(this, 'TalambraluMediaBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
          allowedOrigins: ['*'], // Restrict this in production
          allowedHeaders: ['*'],
        },
      ],
      lifecycleRules: [
        {
          id: 'DeleteVerificationDocs',
          prefix: 'verification-docs/',
          expiration: cdk.Duration.days(14),
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Story 2.2: DLQ for selfie processing
    const selfieDlq = new sqs.Queue(this, 'SelfieProcessingDLQ', {
      retentionPeriod: cdk.Duration.days(14),
    });

    // Story 2.2: SQS Queue for selfie processing
    this.selfieQueue = new sqs.Queue(this, 'SelfieProcessingQueue', {
      visibilityTimeout: cdk.Duration.seconds(300), // Rekognition might take a moment
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: selfieDlq,
      }
    });

    // Story 2.3: DLQ for income processing
    const incomeDlq = new sqs.Queue(this, 'IncomeProcessingDLQ', {
      retentionPeriod: cdk.Duration.days(14),
    });

    // Story 2.3: SQS Queue for income processing
    this.incomeQueue = new sqs.Queue(this, 'IncomeProcessingQueue', {
      visibilityTimeout: cdk.Duration.seconds(300), // Textract might take a moment
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: incomeDlq,
      }
    });

    // Notify SQS when a new object is created in the verification-docs/selfies/ prefix
    // Reverting to 'verification-docs/' for selfies to prevent breaking changes from Story 2.1
    this.mediaBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.SqsDestination(this.selfieQueue),
      { prefix: 'verification-docs/' } // Using the old prefix, but we'll let the application code ignore paystubs
    );

    // Notify SQS when a new object is created in the verification-docs/paystubs/ prefix
    // (Note: This will overlap with the root prefix above. The selfie consumer must ignore paystub keys)
    this.mediaBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.SqsDestination(this.incomeQueue),
      { prefix: 'verification-docs/paystubs/' }
    );

    // Grant Fargate task permissions to read from SQS
    this.selfieQueue.grantConsumeMessages(this.fargateService.taskDefinition.taskRole);
    this.incomeQueue.grantConsumeMessages(this.fargateService.taskDefinition.taskRole);

    // Grant Fargate task permissions to use Rekognition, Textract, and S3 Delete
    this.fargateService.taskDefinition.taskRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['rekognition:DetectFaces'],
        resources: ['*'], // Rekognition DetectFaces doesn't use specific ARNs
      })
    );

    this.fargateService.taskDefinition.taskRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['textract:AnalyzeDocument'],
        resources: ['*'],
      })
    );

    this.fargateService.taskDefinition.taskRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['s3:DeleteObject'],
        resources: [this.mediaBucket.arnForObjects('verification-docs/*')],
      })
    );

    // Pass Queue URLs to container
    this.fargateService.taskDefinition.defaultContainer?.addEnvironment(
      'AWS_SQS_SELFIE_QUEUE_URL',
      this.selfieQueue.queueUrl
    );
    this.fargateService.taskDefinition.defaultContainer?.addEnvironment(
      'AWS_SQS_INCOME_QUEUE_URL',
      this.incomeQueue.queueUrl
    );
  }
}