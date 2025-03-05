import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuthStore from './../../../zustand/authStore';

const AuthSheet = forwardRef((props, ref) => {
    const [screen, setScreen] = useState('login');
    const bottomSheetRef = useRef(null);
    const { login, signup, recoverPassword } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        openSheet: () => bottomSheetRef.current?.expand(),
        closeSheet: () => bottomSheetRef.current?.close(),
    }));

    const schemas = {
        login: yup.object({
            email: yup.string().email().required(),
            password: yup.string().min(6).required(),
        }),
        signup: yup.object({
            name: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string().min(6).required(),
            phone: yup.string().required(),
        }),
        recover: yup.object({
            email: yup.string().email().required(),
        }),
    };

    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schemas[screen]),
    });

    const onSubmit = (data) => {
        let action;
        setIsLoading(true)
        if (screen === 'login') {
            action = login(data);
            console.log(action.data)
        } else if (screen === 'signup') {
            action = signup(data);
        } else {
            action = recoverPassword(data.email);
        }
    
        action
            .then((res) => {
                    reset()
                    bottomSheetRef.current?.close(); // Close bottom sheet on success
                    setIsLoading(false)
            })
            .catch((error) => {
                console.error("Error:", error.error);
                alert(error?.message || "Something went wrong!"); // Display error to the user
                setIsLoading(false)

            })
    };

    return (
        <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={['10%', '80%']} enablePanDownToClose={false}>
            <BottomSheetView>

            <View style={styles.container}>
                <Text style={styles.title}>{screen.toUpperCase()}</Text>

                {screen === 'signup' && (
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <TextInput style={styles.input} placeholder="Name" value={value} onChangeText={onChange} />
                        )}
                    />
                )}

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput style={styles.input} placeholder="Email" value={value} onChangeText={onChange} />
                    )}
                />

                {screen !== 'recover' && (
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={value} onChangeText={onChange} />
                        )}
                    />
                )}

                {screen === 'signup' && (
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, value } }) => (
                            <TextInput style={styles.input} placeholder="Phone" value={value} onChangeText={onChange} />
                        )}
                    />
                )}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>{isLoading ? "Loading...":screen === 'login' ? 'SIGN IN' : screen === 'signup' ? 'REGISTER' : 'RESET PASSWORD'}</Text>
                </TouchableOpacity>

                <View style={styles.switchContainer}>
                    {screen === 'login' && (
                        <View  style={{
                            flexDirection: 'row',
                            gap:10,
                            width: '100%',
                        }}>
                            <Text style={{
                            }}>New customer? </Text>
                            <TouchableOpacity onPress={() => {setScreen('signup');reset()}}>
                                <Text style={styles.link}>Create your account</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {screen !== 'recover' && (
                        <View style={{
                            flexDirection: 'row',
                            gap:10,
                            width: '100%',
                        }}>
                            <Text style={{
                                marginLeft:-3
                            }}> Lost password? </Text>
                            <TouchableOpacity onPress={() =>{ setScreen('recover');reset()}}>
                                <Text style={styles.link}>Recover password</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {screen === 'recover' && (
                        <View style={{
                            display:"flex",
                            flexDirection: 'row',
                            gap:10,
                            alignSelf:"flex-start"
                        }}>
                            <Text> Remembered your password? </Text>
                            <TouchableOpacity onPress={() => {setScreen('login');reset()}}>
                                <Text style={styles.link}>Back to login</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
            </BottomSheetView>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    container: { padding: 20, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
    button: { backgroundColor: 'black', padding: 15, borderRadius: 5, width: '100%', alignItems: 'center', marginVertical: 10 },
    buttonText: { color: 'white', fontWeight: 'bold' },
    switchContainer: { 
        flexDirection: 'column', marginTop: 10,
        alignSelf:"flex-start",
        width:"100%",
        gap:10

     },
    link: { color: 'gray', textDecorationLine: 'underline' },
});

export default AuthSheet;
