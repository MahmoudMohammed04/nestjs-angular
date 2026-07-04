import {  Inject, Injectable } from "@angular/core";
import { firebaseConfig } from "./FireBaseConfig";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth,
        getAuth ,
        createUserWithEmailAndPassword ,
        signInWithEmailAndPassword,
        sendPasswordResetEmail,
        GoogleAuthProvider,
        signInWithPopup, 
        onAuthStateChanged,
        User,
        setPersistence,
        browserLocalPersistence,
        browserSessionPersistence} from "firebase/auth";
import { FIREBASE_CONFIG } from "./FirebaseInjectableToken";
import { BehaviorSubject} from "rxjs";
import { firebaseObjectResult } from "./FirebaseObjectResult";



@Injectable()
export class FirebaseService {

    private readonly config: firebaseConfig;
    private readonly app:FirebaseApp;
    private readonly auth:Auth;
    private readonly GoogleProvider = new GoogleAuthProvider();
    private userSubject = new BehaviorSubject<User|null>(null);
    user$ = this.userSubject.asObservable();
    constructor(@Inject(FIREBASE_CONFIG) config: firebaseConfig)
    {
        this.config = config
        this.app = initializeApp(this.config);
        this.auth = getAuth(this.app);

        onAuthStateChanged(this.auth,(user) => {
            this.userSubject.next(user);
        });
    }

    private getFirebaseErrorMessage(code: string): string {
      switch (code) {
        case 'auth/email-already-in-use':
          return 'This email is already registered.';
          
        case 'auth/invalid-email':
          return 'Invalid email address.';  

        case 'auth/weak-password':
          return 'Password is too weak (min 6 characters).';    

        case 'auth/network-request-failed':
          return 'Network error. Check your internet connection.';  

        default:
          return 'Something went wrong. Please try again.';
      }
    }

    async singIn(email: string, password: string , rememberMe: boolean = false)
    {
        try{
            
            await setPersistence(this.auth,rememberMe ? browserLocalPersistence : browserSessionPersistence);
            const userCredential = await signInWithEmailAndPassword(this.auth,email,password);
            const user = userCredential.user;
            console.log(user);
            return new firebaseObjectResult(null,user,true);
        }
        catch(error : any)
        {
            const code = error.code;
            const message = this.getFirebaseErrorMessage(code);
            return new firebaseObjectResult(error,null,false,message);
        }
    }

    async creatAccount(email: string, password: string , rememberMe: boolean = false)
    {
        try{
            await setPersistence(this.auth,rememberMe ? browserLocalPersistence : browserSessionPersistence);
            const userCredential = await createUserWithEmailAndPassword(this.auth,email,password);
            const user = userCredential.user;
            console.log(user);
            return new firebaseObjectResult(null,user,true);
        }
        catch(error:any)
        {
            const code = error.code;
            const message = this.getFirebaseErrorMessage(code);
            return new firebaseObjectResult(error,null,false,message);
        }
    }
    

    async forgetPasswordEmail(email: string)
    {
        try{
            const result = await sendPasswordResetEmail(this.auth,email);
            console.log(result);
            return new firebaseObjectResult(null,result,true);
        }
        catch(error:any)
        {
            const code = error.code;
            const message = this.getFirebaseErrorMessage(code);
            return new firebaseObjectResult(error,null,false,message);
           
        }
    }

    async signInWithGoogle()
    {
        try{
            
            const result = await signInWithPopup(this.auth,this.GoogleProvider);
            const user = result.user;
            console.log(user);
            return new firebaseObjectResult(null,user,true);
        }
        catch(error:any)
        {
            const code = error.code;
            const message = this.getFirebaseErrorMessage(code);
            return new firebaseObjectResult(error,null,false,message);
        }
    }

    async getToken()
    {
        const user = this.auth.currentUser;
        return user === null ? null : await user.getIdToken();
    }

    async signOut()
    {
        await this.auth.signOut();
    }


}