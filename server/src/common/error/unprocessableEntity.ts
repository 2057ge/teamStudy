import { UnprocessableEntityException } from '@nestjs/common';

function unprocessableEntityException(e: any) {
  return new UnprocessableEntityException({
    e,
  });
}
export { unprocessableEntityException };
