import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Text Stairs Backend')
    .setDescription('Text Stairs Backend roadmap')
    .setVersion('0.0.1')
    .addTag('txs')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
