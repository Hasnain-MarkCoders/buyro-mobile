import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import AppRoutes from "./AppRoutes";
const queryClient = new QueryClient()
function App(){
  return(
 <>
  <QueryClientProvider client={queryClient}>
        <AppRoutes/>
    </QueryClientProvider>
 </>
  )
}

export default App;
