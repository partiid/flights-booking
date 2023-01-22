import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiResponseInterceptor } from './interceptors/apiResponse.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/httpException.filter';
import * as session from 'express-session';
import * as passport from 'passport';
import Redis from 'ioredis';


async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });


    //setup redis session store
    const RedisStore = require('connect-redis')(session);
    const redisClient = new Redis();

    //setup session 
    app.use(session({
        store: new RedisStore({ client: redisClient, logErrors: true }),
        secret: '125A6SD1AS56D1',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000,
            secure: false, //set this to false for now, since we are not using https 
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept',
        );
        next();
    });
    app.useGlobalFilters(new HttpExceptionFilter());
    //setup api response
    //add validation via class validator
    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalInterceptors(new ApiResponseInterceptor());
    //setup swagger
    const config = new DocumentBuilder()
        .setTitle('Flights booking system')
        .setDescription('Flights booking system')
        .setVersion('1.0')
        .addCookieAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    //use cors for all routes
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    await app.listen(3000);
}
bootstrap();
