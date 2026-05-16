-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "income_bracket" TEXT,
ADD COLUMN     "is_face_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_income_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_work_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "search_vector" tsvector;

-- CreateIndex
CREATE INDEX "profiles_search_vector_idx" ON "profiles" USING GIN ("search_vector");

-- CreateTrigger
CREATE OR REPLACE FUNCTION profiles_search_vector_update() RETURNS trigger AS $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.full_name, '')), 'A');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_search_vector_trigger BEFORE INSERT OR UPDATE
  ON "profiles" FOR EACH ROW EXECUTE FUNCTION profiles_search_vector_update();
