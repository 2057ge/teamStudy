import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception/http-exception.filter';
import { MyResponse } from './common/response/response';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { join } from 'path';
async function bootstrap() {
  //修改了auth.guard.ts,role.guard.ts
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(
    session({
      secret: 'wenhong',
      name: 'verify',
      rolling: true,
      cookie: { maxAge: null },
    }),
  );

  app.useGlobalInterceptors(new MyResponse());

  await app.listen(3000);
}
bootstrap();
