<?php

use Illuminate\Database\Seeder;

class NotificationDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create('en_US');

        foreach(range(1, 50) as $index) {
            \App\NotificationData::create([
                'notification_guid' => $faker->uuid,
                'category_id' => rand(1, 10),
                'notification_head' => $faker->sentence($nbWords = 6),
                'notification_body' => $faker->paragraph($nbSentences = 3),
                'created_by' => rand(1, 20),
            ]);
        }
    }
}
