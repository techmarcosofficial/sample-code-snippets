import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'license' })
export class License {
  @Field({ nullable: true })
  submission_id: string;

  @Field({ nullable: true })
  page_name: string;

  @Field({ nullable: true })
  question_name: string;

  @Field({ nullable: true })
  question_text: string;

  @Field({ nullable: true })
  value: string;

  @Field({ nullable: true })
  opportunity_id: string;
}
