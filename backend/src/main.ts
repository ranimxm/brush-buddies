import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const PORT = 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  });
  await app.listen(PORT);
  console.log(`port is running on localhost:${PORT}`);
}
bootstrap();
