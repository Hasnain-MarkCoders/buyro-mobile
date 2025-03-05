import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import AppRoutes from "./AppRoutes";
import { useEffect } from 'react';
import LottieSplashScreen from "react-native-lottie-splash-screen";
import { initStripe } from '@stripe/stripe-react-native';
  import { LogBox } from "react-native";
  import ToastManager from "toastify-react-native";

const queryClient = new QueryClient()
function App(){

  // You can choose the warnings you want to ignore for example
  LogBox.ignoreLogs([
    'Sending `onAnimatedValueUpdate` with no listeners registered.', 
    'Possible unhandled promise rejection (id:0: Network request failed)',
    'VirtualizedList: You have a large list that is slow to update',
  ]);
  
  // Or you can choose to just ignore all by doing this
  LogBox.ignoreAllLogs(true);
  useEffect(()=>{
    async function initialize() {
      try{
        const publishableKey = 'pk_test_51PgyoABNaSUJLyUp1sK8eLjGKuN0EeTVXZq4SvmRR30AGUkytx3znUpTXzWFMv9Bzmv35F9fWbiifqftEQ9iZwID00YnB0KMDp';
        await initStripe({
          publishableKey,
          merchantIdentifier: 'merchant.com.stripe.react.native',
        });
      }catch(error){
        console.log(error)
      }
     
      
    }
initialize();
    LottieSplashScreen.hide(); // here

  },[])
  return(
 <>
  <QueryClientProvider client={queryClient}>
  <ToastManager />

        <AppRoutes/>
    </QueryClientProvider>
 </>
  )
}

export default App;
