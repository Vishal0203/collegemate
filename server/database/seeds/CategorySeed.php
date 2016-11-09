<?php

use Illuminate\Database\Seeder;
use App\Category;

class CategorySeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create('en_US');

        foreach(range(1, 10) as $index) {
            Category::create([
                'category_guid' => $faker->uuid,
                'institute_id' => rand(1, 10),
                'category_type' => $faker->word,
                'category_desc' => $faker->sentence($nbWords = 6),
                'created_by' => rand(1, 20),
            ]);
        }
    }
}
