import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
// import { PubSub } from 'graphql-subscriptions';
// import { NewRecipeInput } from '../dto/new-recipe.input';
// import { UpdateRecipeInput } from '../dto/update-recipe.input';
// import { RecipesArgs } from '../dto/recipes.args';
import { License } from '../models/license.model';
import { LicensesService } from '../licenses.service';

// const pubSub = new PubSub();

@Resolver((of: any) => License)
export class LicenseResolver {
  constructor(private readonly licenseService: LicensesService) {}

  // @Query((returns) => [License])
  // licenses(): Promise<License[]> {
  //   return this.licenseService.findAll();
  // }

  // @Query((returns) => License)
  // async license(@Args('id') id: string): Promise<License> {
  //   const license = await this.licenseService.findById(id);
  //   if (!license) {
  //     throw new NotFoundException(id);
  //   }
  //   return license;
  // }

  // @Query((returns) => [License])
  // async licensesByQuestionName(@Args('name') name: string): Promise<License[]> {
  //   return await this.licenseService.findByQuestionName(name);
  // }

  //   @Mutation((returns) => License)
  //   async addRecipe(
  //     @Args('newRecipe') newRecipeData: NewRecipeInput,
  //   ): Promise<License> {
  //     const recipe = await this.mssqlService.create(newRecipeData);
  //     return recipe;
  //   }

  //   @Mutation((returns) => License)
  //   async updateRecipe(
  //     @Args('id') id: string,
  //     @Args('updatedRecipe') updatedRecipeData: UpdateRecipeInput,
  //   ): Promise<License> {
  //     const recipe = await this.mssqlService.update(id, updatedRecipeData);
  //     return recipe;
  //   }

  //   @Mutation((returns) => Boolean)
  //   async removeRecipe(@Args('id') id: string) {
  //     return this.mssqlService.remove(id);
  //   }

  //   @Subscription((returns) => License)
  //   recipeAdded() {
  //     return pubSub.asyncIterator('recipeAdded');
  //   }
}
