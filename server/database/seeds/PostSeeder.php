<?php

use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create('en_US');
        $user_ids = [1, 2, 3, 6, 7, 8, 10, 12, 13, 17, 19];
        foreach (range(1, 50) as $index) {
            \App\Post::create([
                'post_guid' => $faker->uuid,
                'user_id' => $user_ids[rand(0, 10)],
                'institute_id' => 1,
                'post_heading' => $faker->sentence($nbWords = 6),
                'post_description' => $faker->paragraph($nbSentences = 3),
            ]);
        }
    }
}
