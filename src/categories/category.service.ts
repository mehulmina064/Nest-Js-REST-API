import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category,Status } from './category.entity';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async paginate(options: IPaginationOptions): Promise<Pagination<Category>> {
    return (paginate<Category>(this.categoryRepository, options));
    
    
  }
  async findAll(): Promise<Category[]> {  
    let allCategory= await this.categoryRepository.find({where:{status:Status.ACTIVE}});
    // let allCategory= await this.categoryRepository.find();

    //hiding categorys
      for(var i = 0; i < allCategory.length; i++) {
        let s=allCategory[i]
        s.status=Status.ACTIVE
        await this.categoryRepository.update(s.id,s)
    }
  
    // console.log(allCategory);
    return allCategory;
  }
  async findByParent(parent: string): Promise<Category[]> {
    return await this.categoryRepository.find({ parentCategoryId: parent });
  }

  async categoryName(id: string): Promise<string>{ 
    let data1 = await this.categoryRepository.findOne(id);
    // console.log(id,data1);
    if(data1){
      // console.log(data1.categoryName);
      return data1.categoryName;
    }else{
      // console.log("other");
      return 'Others'
    } 
  }

  async findOne(id: string): Promise<Category> {
    return await this.categoryRepository.findOne(id);
  }
  async findCategoryId(categoryName: string) {
    let category = await this.categoryRepository.findOne({
      where: { categoryName: categoryName },
    });
    if (!category) {
      category = new Category();
      category.categoryName = categoryName;
      category = await this.categoryRepository.save(category);
    }
    return category.id.toString();
  }

  async save(category: Category) {
    return await this.categoryRepository.save(category);
  }

  async update(id, category: Partial<Category>) {
    await this.categoryRepository.update(id, category);
    return await this.findOne(id);
  }

  async remove(id) {
    const user = this.categoryRepository.findOne(id).then(result => {
      this.categoryRepository.delete(result);
    });
  }

  async findByCategoryName(categoryName: string) {
    let category= await this.categoryRepository.findOne({
      where: { categoryName: categoryName },
    });
    if (!category) {
      return null;
    }
    return String(category.id)
  }
}
