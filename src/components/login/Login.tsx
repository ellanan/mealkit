import { GoogleLogin } from 'react-google-login';
import { useAuthContext } from '../../useAuthContext';

export const Login = () => {
  const { signIn } = useAuthContext();

  return (
    <>
      <button onClick={signIn}>log in or signup</button>
    </>
  );
};
