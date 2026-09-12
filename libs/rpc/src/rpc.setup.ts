import { INestApplication, ValidationPipe } from "@nestjs/common";
import { RpcExceptionFilter } from "./rpc-exception.filter";


export function applyToMicroservicesLayer(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.useGlobalFilters(new RpcExceptionFilter());

}