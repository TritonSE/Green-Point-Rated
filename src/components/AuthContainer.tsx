import React, { useContext, useEffect } from 'react';
import { Button, SafeAreaView, Text } from 'react-native';
import { withAuthenticator, AmplifyTheme } from 'aws-amplify-react-native';
import { Auth, I18n, API } from 'aws-amplify';
import { Translations } from '@aws-amplify/ui-components';
import Onboarding from './Onboarding/Onboarding';
import AuthenticatorTheme from '../styles/AuthenticatorTheme';
import { AppContext } from '../contexts/AppContext';

import { getUser } from '../graphql/queries';
import { UserContext } from '../contexts/UserContext';

Auth.configure({ mandatorySignIn: true });

function App(): JSX.Element | null {
  const { appState, setAppState } = useContext(AppContext);
  const { userState, setUserState } = useContext(UserContext);

  useEffect(() => {
    const getUserData = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const result = await API.graphql({
        query: getUser,
        variables: { id: user.attributes.sub },
      });
      setUserState(result.data.getUser);
    };

    getUserData();
    // console.log(userState);
    if (userState.homes.items.length === 0) {
      setAppState('Onboarding');
    } else {
      setAppState('App');
    }
  }, [appState, setAppState, userState, setUserState]);

  const signOut = async () => {
    try {
      await Auth.signOut();
      setAppState('Auth');
    } catch (error) {
      console.error('Error sign out: ', error);
    }
  };

  return (
    <>
      {appState === 'Onboarding' && <Onboarding />}
      {appState === 'App' && (
        <SafeAreaView>
          <Text>Use React Navigation here</Text>
          <Button title="Sign Out" onPress={signOut} />
        </SafeAreaView>
      )}
    </>
  );
}

const MyTheme = { ...AmplifyTheme, ...AuthenticatorTheme };
// Unstable changing section header text: https://github.com/aws-amplify/amplify-js/issues/6115
I18n.putVocabulariesForLanguage('en-US', {
  [Translations.SIGN_IN_HEADER_TEXT]: 'Welcome to Your Clear Way',
  [Translations.SIGN_UP_HEADER_TEXT]: 'Welcome to Your Clear Way',
});

export default withAuthenticator(App, {
  theme: MyTheme,
  usernameAttributes: 'email',
  signUpConfig: {
    hiddenDefaults: ['username', 'phone_number'],
    signUpFields: [
      {
        label: 'Display Name',
        placeholder: 'Enter your display name',
        key: 'custom:displayName',
        required: true,
        displayOrder: 2,
        type: 'string',
      },
      {
        label: 'Email',
        placeholder: 'Enter your email',
        key: 'email',
        required: true,
        displayOrder: 3,
        type: 'string',
      },
      {
        label: 'Password',
        placeholder: 'Enter your password',
        key: 'password',
        required: true,
        displayOrder: 4,
        type: 'password',
      },
    ],
  },
});
