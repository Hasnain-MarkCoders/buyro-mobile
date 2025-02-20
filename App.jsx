import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import AppRoutes from "./AppRoutes";
import SplashScreen from 'react-native-splash-screen'
import { useEffect } from 'react';
const queryClient = new QueryClient()
function App(){
  useEffect(()=>{
    SplashScreen.hide();
  },[])
  return(
 <>
  <QueryClientProvider client={queryClient}>
        <AppRoutes/>
    </QueryClientProvider>
 </>
  )
}

export default App;
