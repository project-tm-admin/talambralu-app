/**
 * Navigation — auth-aware routing
 *
 * States:
 *  authLoading   → SplashScreen (Firebase resolving)
 *  not authed    → Auth stack (Welcome, SignIn, EmailSignup, PhoneSignup, OTP, ForgotPassword)
 *  authed + no onboarding → Onboarding stack
 *  authed + onboarded → Main tabs
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../theme';
import { useApp } from '../store/AppContext';

// ── Splash ─────────────────────────────────────────────────────────────────
import SplashScreenView from '../screens/auth/SplashScreen';

// ── Auth screens ───────────────────────────────────────────────────────────
import WelcomeScreen       from '../screens/auth/WelcomeScreen';
import EmailSignupScreen   from '../screens/auth/EmailSignupScreen';
import PhoneSignupScreen   from '../screens/auth/PhoneSignupScreen';
import OTPScreen           from '../screens/auth/OTPScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import SignInScreen        from '../screens/auth/SignInScreen';

// ── Onboarding screens ─────────────────────────────────────────────────────
import NameDOBScreen       from '../screens/profile/NameDOBScreen';
import GenderScreen        from '../screens/profile/GenderScreen';
import USLocationScreen    from '../screens/profile/USLocationScreen';
import IndiaOriginScreen   from '../screens/profile/IndiaOriginScreen';
import ReligionScreen      from '../screens/profile/ReligionScreen';
import EducationScreen     from '../screens/profile/EducationScreen';
import VisaScreen          from '../screens/profile/VisaScreen';
import FamilyScreen        from '../screens/profile/FamilyScreen';
import HoroscopeScreen     from '../screens/profile/HoroscopeScreen';
import DietScreen          from '../screens/profile/DietScreen';
import PhotosScreen        from '../screens/profile/PhotosScreen';
import AboutScreen         from '../screens/profile/AboutScreen';
import PreferencesScreen   from '../screens/profile/PreferencesScreen';
import ProfileManagerScreen from '../screens/profile/ProfileManagerScreen';
import VerifyScreen        from '../screens/profile/VerifyScreen';

// ── Main app screens ────────────────────────────────────────────────────────
import MyProfileScreen     from '../screens/profile/MyProfileScreen';
import VerificationsScreen from '../screens/profile/VerificationsScreen';
import ProfileVisitorsScreen from '../screens/profile/ProfileVisitorsScreen';
import EditProfileScreen   from '../screens/profile/EditProfileScreen';
import EditPhotosScreen    from '../screens/profile/EditPhotosScreen';
import EditAboutScreen     from '../screens/profile/EditAboutScreen';
import EditCareerScreen    from '../screens/profile/EditCareerScreen';
import EditFamilyScreen    from '../screens/profile/EditFamilyScreen';
import EditJaathakamScreen from '../screens/profile/EditJaathakamScreen';
import EditTrustScreen     from '../screens/profile/EditTrustScreen';
import EditBasicsScreen    from '../screens/profile/EditBasicsScreen';
import PrivacyScreen       from '../screens/profile/PrivacyScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import LoginSecurityScreen from '../screens/profile/LoginSecurityScreen';
import ShortlistedYouScreen from '../screens/profile/ShortlistedYouScreen';
import YourShortlistScreen from '../screens/profile/YourShortlistScreen';

import MatchesScreen       from '../screens/browse/MatchesScreen';
import MatchDetailScreen   from '../screens/browse/MatchDetailScreen';
import SearchScreen        from '../screens/browse/SearchScreen';
import FiltersScreen       from '../screens/browse/FiltersScreen';

import InboxScreen         from '../screens/messaging/InboxScreen';
import ChatScreen          from '../screens/messaging/ChatScreen';
import CallScreen          from '../screens/messaging/CallScreen';

import PremiumScreen       from '../screens/premium/PremiumScreen';
import PaywallSheet        from '../screens/premium/PaywallSheet';

import DocumentUploadScreen  from '../screens/verification/DocumentUploadScreen';
import FaceVerificationScreen from '../screens/verification/FaceVerificationScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

// ── Tab icons ──────────────────────────────────────────────────────────────
function DiscoverIcon({ focused }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={focused ? T.ink : T.mute} strokeWidth={focused ? 2.2 : 1.6} />
      <Path d="M21 21l-4.35-4.35" stroke={focused ? T.ink : T.mute} strokeWidth={focused ? 2.2 : 1.6} strokeLinecap="round" />
    </Svg>
  );
}
function MatchesIcon({ focused }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        stroke={focused ? T.accent : T.mute}
        strokeWidth={focused ? 2.2 : 1.6}
        fill={focused ? T.accent : 'none'}
      />
    </Svg>
  );
}
function InboxIcon({ focused, badge }) {
  return (
    <View>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
          stroke={focused ? T.ink : T.mute}
          strokeWidth={focused ? 2.2 : 1.6}
          fill={focused ? T.field : 'none'}
        />
      </Svg>
      {badge > 0 && (
        <View style={tabStyles.badge}>
          <Text style={tabStyles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      )}
    </View>
  );
}
function ProfileIcon({ focused }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={focused ? T.ink : T.mute} strokeWidth={focused ? 2.2 : 1.6} fill={focused ? T.field : 'none'} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={focused ? T.ink : T.mute} strokeWidth={focused ? 2.2 : 1.6} strokeLinecap="round" />
    </Svg>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const { unreadCount } = useApp();
  const insets = useSafeAreaInsets();
  const TAB_CONFIG = [
    { key: 'Matches', Icon: MatchesIcon, label: 'MATCHES' },
    { key: 'Search',  Icon: DiscoverIcon, label: 'SEARCH' },
    { key: 'Inbox',   Icon: InboxIcon, label: 'INBOX' },
    { key: 'Profile', Icon: ProfileIcon, label: 'PROFILE' },
  ];

  return (
    <View style={[tabStyles.tabBar, { paddingBottom: insets.bottom + 4 }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const config  = TAB_CONFIG.find(c => c.key === route.name) || TAB_CONFIG[0];
        const { Icon } = config;
        return (
          <TouchableOpacity
            key={route.key}
            style={tabStyles.tabItem}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <Icon focused={focused} badge={route.name === 'Inbox' ? unreadCount : 0} />
            <Text style={[tabStyles.tabLabel, focused && tabStyles.tabLabelActive]}>
              {config.label}
            </Text>
            {focused && <View style={tabStyles.tabDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Search"  component={SearchScreen} />
      <Tab.Screen name="Inbox"   component={InboxScreen} />
      <Tab.Screen name="Profile" component={MyProfileScreen} />
    </Tab.Navigator>
  );
}

const SLIDE = ({ current, layouts }) => ({
  cardStyle: {
    transform: [{
      translateX: current.progress.interpolate({
        inputRange:  [0, 1],
        outputRange: [layouts.screen.width, 0],
      }),
    }],
  },
});

export default function Navigation({ navigationRef, onReady }) {
  const { authLoading, isAuthenticated, isOnboarded } = useApp();

  if (authLoading) {
    return (
      <SafeAreaProvider>
        <SplashScreenView />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} onReady={onReady}>
        <Stack.Navigator
          screenOptions={{ headerShown: false, cardStyleInterpolator: SLIDE }}
        >
          {!isAuthenticated ? (
            // ── Auth stack ──────────────────────────────────────────────────
            <>
              <Stack.Screen name="Welcome"        component={WelcomeScreen} />
              <Stack.Screen name="EmailSignup"    component={EmailSignupScreen} />
              <Stack.Screen name="PhoneSignup"    component={PhoneSignupScreen} />
              <Stack.Screen name="OTP"            component={OTPScreen} />
              <Stack.Screen name="SignIn"         component={SignInScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          ) : !isOnboarded ? (
            // ── Onboarding stack ────────────────────────────────────────────
            <>
              <Stack.Screen name="NameDOB"        component={NameDOBScreen} />
              <Stack.Screen name="Gender"         component={GenderScreen} />
              <Stack.Screen name="USLocation"     component={USLocationScreen} />
              <Stack.Screen name="IndiaOrigin"    component={IndiaOriginScreen} />
              <Stack.Screen name="Religion"       component={ReligionScreen} />
              <Stack.Screen name="Education"      component={EducationScreen} />
              <Stack.Screen name="Visa"           component={VisaScreen} />
              <Stack.Screen name="Family"         component={FamilyScreen} />
              <Stack.Screen name="Horoscope"      component={HoroscopeScreen} />
              <Stack.Screen name="Diet"           component={DietScreen} />
              <Stack.Screen name="Photos"         component={PhotosScreen} />
              <Stack.Screen name="About"          component={AboutScreen} />
              <Stack.Screen name="Preferences"    component={PreferencesScreen} />
              <Stack.Screen name="ProfileManager" component={ProfileManagerScreen} />
              <Stack.Screen name="Verify"         component={VerifyScreen} />
            </>
          ) : (
            // ── Main app ────────────────────────────────────────────────────
            <>
              <Stack.Screen name="MainTabs"          component={MainTabs} />
              <Stack.Screen name="MatchDetail"        component={MatchDetailScreen} />
              <Stack.Screen name="Filters"            component={FiltersScreen} />
              <Stack.Screen name="Chat"               component={ChatScreen} />
              <Stack.Screen name="Call"               component={CallScreen} />
              <Stack.Screen name="Verifications"      component={VerificationsScreen} />
              <Stack.Screen name="DocumentUpload"     component={DocumentUploadScreen} />
              <Stack.Screen name="FaceVerification"   component={FaceVerificationScreen} />
              <Stack.Screen name="ProfileVisitors"    component={ProfileVisitorsScreen} />
              <Stack.Screen name="EditProfile"        component={EditProfileScreen} />
              <Stack.Screen name="EditPhotos"         component={EditPhotosScreen} />
              <Stack.Screen name="EditAbout"          component={EditAboutScreen} />
              <Stack.Screen name="EditCareer"         component={EditCareerScreen} />
              <Stack.Screen name="EditFamily"         component={EditFamilyScreen} />
              <Stack.Screen name="EditJaathakam"      component={EditJaathakamScreen} />
              <Stack.Screen name="EditTrust"          component={EditTrustScreen} />
              <Stack.Screen name="EditBasics"         component={EditBasicsScreen} />
              <Stack.Screen name="Privacy"            component={PrivacyScreen} />
              <Stack.Screen name="Notifications"      component={NotificationsScreen} />
              <Stack.Screen name="LoginSecurity"      component={LoginSecurityScreen} />
              <Stack.Screen name="ShortlistedYou"     component={ShortlistedYouScreen} />
              <Stack.Screen name="YourShortlist"      component={YourShortlistScreen} />
              <Stack.Screen name="Premium"            component={PremiumScreen} />
              <Stack.Screen
                name="Paywall"
                component={PaywallSheet}
                options={{ presentation: 'transparentModal', cardOverlayEnabled: true }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: T.bg,
    borderTopWidth: 1,
    borderTopColor: T.hair,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    position: 'relative',
  },
  tabLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 0.8,
    color: T.mute,
  },
  tabLabelActive: { color: T.ink },
  tabDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.accent,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: T.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
});
