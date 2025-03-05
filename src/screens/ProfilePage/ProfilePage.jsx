import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import AuthSheet from '../AuthScreens/Auth/Auth';
import { useFocusEffect } from '@react-navigation/native';
import useAuthStore from './../../zustand/authStore';
import { post } from './../../config/requests';

const ProfilePage = () => {
  const authSheetRef = useRef(null);
  const isLoggedIn = useAuthStore(state=>state.user?true:false)
  const user = useAuthStore(state=>state?.user)
  const logout = useAuthStore((state) => state.logout);
  const [customer, setCustomer] = useState(user?.customer);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleOpenSheet = useCallback(()=>{
    if(!isLoggedIn){
      setTimeout(()=>{
        authSheetRef?.current?.openSheet();

      },0)
    }
  },[isLoggedIn])
useFocusEffect(
  handleOpenSheet
);

  useEffect(() => {
    handleOpenSheet()
  }, [isLoggedIn]);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const response = await post('/app/customer/update',{name:customer.name});
      // Alert.alert("Success", "Profile updated successfully!");
      if (response?.data?.customer) {
        console.log("this is state data", JSON.stringify(user, null, 4))
        console.log("this is api response", JSON.stringify(response.data.customer, null, 4))
        useAuthStore.getState().updateUser(response.data.customer); // Update Zustand state
      }
    } catch (error) {
      console.log(error.status)
      // Alert.alert("Error", error.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };
const handleLogoutAndOpenAuthSheet = () => {
    logout();
    setCustomer(null)
    handleOpenSheet();
  };

  const handleLogout = async () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: async () => {
          try {
            handleLogoutAndOpenAuthSheet()
          } catch (error) {
            Alert.alert("Error", "Failed to logout.");
          }
        }
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert("Confirm", "Are you sure you want to delete your account?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            await post('/app/customer/delete');
            Alert.alert("Deleted", "Your account has been deleted.",[
              {text:"login again", onPress:()=>{handleLogoutAndOpenAuthSheet()}}
            ]);
          } catch (error) {
            Alert.alert("Error", "Failed to delete account.");
          }
        }
      },
    ]);
  };

  if (!isLoggedIn || !customer ) {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.title}>Profile {isLoggedIn?"true":"false"} {customer?JSON.stringify(customer, null,4):"customer ni mila"}</Text> */}
        <AuthSheet ref={authSheetRef} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <TextInput 
        style={styles.input} 
        value={customer?.name} 
        onChangeText={(text) => setCustomer({ ...customer, name: text })} 
        placeholder="Name" 
      />
      <TextInput 
        style={styles.input} 
        value={customer?.email} 
        onChangeText={(text) => setCustomer({ ...customer, email: text })} 
        editable={true} 
        placeholder="Email (cannot change)" 
      />
      <TextInput 
        style={styles.input} 
        value={customer?.phone?.toString()} 
        onChangeText={(text) => setCustomer({ ...customer, phone: text })} 
        placeholder="Phone" 
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={isUpdating}>
        <Text style={styles.buttonText}>{isUpdating ? "Updating..." : "Update Info"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProfilePage

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  button: { backgroundColor: 'black', padding: 15, borderRadius: 5, width: '100%', alignItems: 'center', marginVertical: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  logoutButton: { backgroundColor: 'gray' },
  deleteButton: { backgroundColor: 'red' },
});
