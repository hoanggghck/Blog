import { SetMetadata } from '@nestjs/common';

export const SkipTimeout = () => SetMetadata("skipTimeout", true);
