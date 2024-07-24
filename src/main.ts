import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(new ConfigService()),
  });
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Geek Framework')
    .setDescription("The geek framework's API REST Documentation")
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new HttpExceptionFilter());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
    })
  );
  const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000
  await app.listen(port, '0.0.0.0');
  const appUrl = await app.getUrl();
  Logger.log(`App is running on ${appUrl}`, 'Geek Framework');
}
bootstrap();
