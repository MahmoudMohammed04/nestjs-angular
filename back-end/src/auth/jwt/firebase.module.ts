import { Global, Module } from "@nestjs/common";
import { FirebaseService } from "./firebaseAdmin";


@Global()
@Module({
    controllers: [],
    providers: [FirebaseService],
    exports: [FirebaseService]
})
export class FirebaseModule {}