import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule , DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, 
        httpOnly: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Back-end')
    .setDescription('The back-end API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
