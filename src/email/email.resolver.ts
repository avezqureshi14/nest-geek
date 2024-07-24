import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SendEmailResponse } from './dto/send-email-response.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';

@Resolver('Email')
export class EmailResolver {
  constructor(private readonly emailService: EmailService) {}

  @Query(() => String)
  hello(): string {
    return 'Hello, World!';
  }

  @Mutation(() => SendEmailResponse)
  async sendEmail(@Args({ name: 'input', type: () => SendEmailDto }) data: SendEmailDto): Promise<SendEmailResponse> {
    return await this.emailService.sendEmail(data);
  }
}
