const axios = require('axios');

const BASE_URL = 'http://localhost:5002/api';
let authToken;

const practitioners = [
  {
    userData: {
      name: 'Dr. Elijah Anderson',
      email: 'elijah@rupert.com',
      password: 'Test123!',
      role: 'practitioner'
    },
    profileData: {
      bio: 'Dr. Elijah Anderson is a compassionate and experienced holistic health practitioner with over 15 years of experience in integrative medicine. He specializes in combining traditional healing practices with modern wellness approaches.',
      specialties: ['Holistic Medicine', 'Stress Management', 'Nutritional Therapy', 'Mind-Body Medicine'],
      experience: 15,
      education: [
        'MD in Integrative Medicine, Harvard Medical School',
        'Fellowship in Holistic Health, Mayo Clinic',
        'Certification in Nutritional Medicine, Johns Hopkins'
      ],
      availability: [
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00' },
        { dayOfWeek: 'Friday', startTime: '09:00', endTime: '15:00' }
      ],
      consultationFee: 150
    },
    blogPosts: [
      {
        title: 'The Power of Mindful Breathing',
        content: 'Mindful breathing is a simple yet powerful technique that can help reduce stress and anxiety. Practice deep breathing for just 5 minutes daily to experience its benefits. Focus on slow, deliberate breaths and notice how your body responds to this calming practice.',
        richContent: '<h1>The Power of Mindful Breathing</h1><p>Mindful breathing is a simple yet powerful technique that can help reduce stress and anxiety. Practice deep breathing for just 5 minutes daily to experience its benefits. Focus on slow, deliberate breaths and notice how your body responds to this calming practice.</p>',
        summary: 'Discover how mindful breathing can transform your daily life and reduce stress.',
        readTime: '3 min',
        tags: ['mindfulness', 'stress-relief', 'wellness']
      },
      {
        title: 'Natural Ways to Boost Your Immune System',
        content: 'Supporting your immune system naturally is crucial for overall health. Key practices include getting adequate sleep, eating a rainbow of fruits and vegetables, staying hydrated, and managing stress levels. These simple steps can make a significant difference in your body\'s ability to fight off illness.',
        richContent: '<h1>Natural Ways to Boost Your Immune System</h1><p>Supporting your immune system naturally is crucial for overall health. Key practices include getting adequate sleep, eating a rainbow of fruits and vegetables, staying hydrated, and managing stress levels. These simple steps can make a significant difference in your body\'s ability to fight off illness.</p>',
        summary: 'Learn effective natural methods to strengthen your immune system.',
        readTime: '4 min',
        tags: ['immunity', 'natural-health', 'wellness']
      },
      {
        title: 'Understanding the Gut-Brain Connection',
        content: 'The gut-brain axis is a fascinating connection that influences both physical and mental health. A healthy gut microbiome can improve mood, reduce anxiety, and enhance cognitive function. Focus on probiotic-rich foods and fiber to support this important connection.',
        richContent: '<h1>Understanding the Gut-Brain Connection</h1><p>The gut-brain axis is a fascinating connection that influences both physical and mental health. A healthy gut microbiome can improve mood, reduce anxiety, and enhance cognitive function. Focus on probiotic-rich foods and fiber to support this important connection.</p>',
        summary: 'Explore the fascinating relationship between your gut health and mental wellbeing.',
        readTime: '5 min',
        tags: ['gut-health', 'mental-health', 'nutrition']
      },
      {
        title: 'Simple Daily Detox Practices',
        content: 'Detoxification doesn\'t require extreme measures. Simple daily practices like drinking lemon water, dry brushing, and eating cruciferous vegetables can support your body\'s natural detox processes. Consistency is key when it comes to gentle, sustainable detox practices.',
        richContent: '<h1>Simple Daily Detox Practices</h1><p>Detoxification doesn\'t require extreme measures. Simple daily practices like drinking lemon water, dry brushing, and eating cruciferous vegetables can support your body\'s natural detox processes. Consistency is key when it comes to gentle, sustainable detox practices.</p>',
        summary: 'Discover gentle and effective daily practices for natural detoxification.',
        readTime: '3 min',
        tags: ['detox', 'natural-health', 'wellness']
      },
      {
        title: 'The Healing Power of Sleep',
        content: 'Quality sleep is fundamental to health and healing. During deep sleep, your body repairs tissues, consolidates memories, and balances hormones. Create a relaxing bedtime routine and aim for 7-9 hours of sleep each night for optimal health benefits.',
        richContent: '<h1>The Healing Power of Sleep</h1><p>Quality sleep is fundamental to health and healing. During deep sleep, your body repairs tissues, consolidates memories, and balances hormones. Create a relaxing bedtime routine and aim for 7-9 hours of sleep each night for optimal health benefits.</p>',
        summary: 'Learn why quality sleep is crucial for your overall health and healing.',
        readTime: '4 min',
        tags: ['sleep', 'healing', 'wellness']
      }
    ]
  },
  {
    userData: {
      name: 'Dr. Thomas Quipp',
      email: 'thomas@rupert.com',
      password: 'Test123!',
      role: 'practitioner'
    },
    profileData: {
      bio: 'Dr. Thomas Quipp is a renowned naturopathic physician with a passion for integrative medicine and functional nutrition. With over 12 years of experience, he combines evidence-based natural therapies with modern medical knowledge to help patients achieve optimal health.',
      specialties: ['Naturopathic Medicine', 'Functional Nutrition', 'Herbal Medicine', 'Chronic Disease Management'],
      experience: 12,
      education: [
        'Doctor of Naturopathic Medicine, Bastyr University',
        'Masters in Clinical Nutrition, University of Washington',
        'Advanced Certification in Functional Medicine, Institute for Functional Medicine'
      ],
      availability: [
        { dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '18:00' },
        { dayOfWeek: 'Thursday', startTime: '10:00', endTime: '18:00' },
        { dayOfWeek: 'Saturday', startTime: '09:00', endTime: '14:00' }
      ],
      consultationFee: 135
    },
    blogPosts: [
      {
        title: 'Understanding Autoimmune Conditions',
        content: 'Autoimmune conditions are complex disorders where the body\'s immune system mistakenly attacks healthy cells. Through a combination of dietary modifications, stress management, and targeted supplementation, many patients can find relief and improve their quality of life.',
        richContent: '<h1>Understanding Autoimmune Conditions</h1><p>Autoimmune conditions are complex disorders where the body\'s immune system mistakenly attacks healthy cells. Through a combination of dietary modifications, stress management, and targeted supplementation, many patients can find relief and improve their quality of life.</p>',
        summary: 'Learn about natural approaches to managing autoimmune conditions.',
        readTime: '5 min',
        tags: ['autoimmune', 'natural-health', 'functional-medicine']
      },
      {
        title: 'The Power of Herbal Medicine',
        content: 'Herbal medicine has been used for thousands of years to support health and healing. Modern research is now validating many traditional uses of herbs, from echinacea for immune support to turmeric for inflammation. Learn how to safely incorporate herbs into your health routine.',
        richContent: '<h1>The Power of Herbal Medicine</h1><p>Herbal medicine has been used for thousands of years to support health and healing. Modern research is now validating many traditional uses of herbs, from echinacea for immune support to turmeric for inflammation. Learn how to safely incorporate herbs into your health routine.</p>',
        summary: 'Discover the science-backed benefits of traditional herbal remedies.',
        readTime: '4 min',
        tags: ['herbs', 'natural-medicine', 'healing']
      },
      {
        title: 'Food as Medicine: Healing Through Nutrition',
        content: 'The food we eat can be either the foundation of health or a source of disease. Understanding how different foods affect our body\'s systems is key to using nutrition as a therapeutic tool. Learn about anti-inflammatory foods, elimination diets, and therapeutic meal planning.',
        richContent: '<h1>Food as Medicine: Healing Through Nutrition</h1><p>The food we eat can be either the foundation of health or a source of disease. Understanding how different foods affect our body\'s systems is key to using nutrition as a therapeutic tool. Learn about anti-inflammatory foods, elimination diets, and therapeutic meal planning.</p>',
        summary: 'Explore how proper nutrition can be used as a powerful healing tool.',
        readTime: '6 min',
        tags: ['nutrition', 'healing', 'functional-medicine']
      },
      {
        title: 'Managing Chronic Fatigue Naturally',
        content: 'Chronic fatigue can be debilitating and complex. By addressing root causes such as mitochondrial dysfunction, hormonal imbalances, and gut health, we can develop effective natural strategies for restoring energy and vitality.',
        richContent: '<h1>Managing Chronic Fatigue Naturally</h1><p>Chronic fatigue can be debilitating and complex. By addressing root causes such as mitochondrial dysfunction, hormonal imbalances, and gut health, we can develop effective natural strategies for restoring energy and vitality.</p>',
        summary: 'Natural approaches to understanding and treating chronic fatigue.',
        readTime: '5 min',
        tags: ['chronic-fatigue', 'energy', 'natural-health']
      },
      {
        title: 'Environmental Medicine: Your Home and Your Health',
        content: 'Our environment plays a crucial role in our health. From air quality to electromagnetic fields, understanding and minimizing environmental toxins can significantly impact our wellbeing. Learn practical steps to create a healthier home environment.',
        richContent: '<h1>Environmental Medicine: Your Home and Your Health</h1><p>Our environment plays a crucial role in our health. From air quality to electromagnetic fields, understanding and minimizing environmental toxins can significantly impact our wellbeing. Learn practical steps to create a healthier home environment.</p>',
        summary: 'Discover how your environment affects your health and what you can do about it.',
        readTime: '4 min',
        tags: ['environmental-health', 'toxins', 'wellness']
      }
    ]
  }
];

async function seedPractitioner(practitionerData) {
  try {
    // First try to login, if it fails then register
    try {
      console.log(`Attempting to login ${practitionerData.userData.name}...`);
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: practitionerData.userData.email,
        password: practitionerData.userData.password
      });
      authToken = loginResponse.data.token;
      console.log('Logged in successfully');
    } catch (error) {
      console.log('Login failed, registering new practitioner...');
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, practitionerData.userData);
      console.log('Practitioner registered successfully');

      // Login after registration
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: practitionerData.userData.email,
        password: practitionerData.userData.password
      });
      authToken = loginResponse.data.token;
      console.log('Logged in successfully');
    }

    // Update practitioner profile
    console.log('Updating practitioner profile...');
    await axios.put(
      `${BASE_URL}/practitioners/profile`,
      practitionerData.profileData,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('Profile updated successfully');

    // Create blog posts
    console.log('Creating blog posts...');
    for (const post of practitionerData.blogPosts) {
      await axios.post(
        `${BASE_URL}/blogs`,
        post,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      console.log(`Blog post "${post.title}" created successfully`);
    }

    console.log(`All data seeded successfully for ${practitionerData.userData.name}!`);
  } catch (error) {
    console.error('Error seeding data:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

async function seedAllPractitioners() {
  for (const practitioner of practitioners) {
    await seedPractitioner(practitioner);
  }
}

seedAllPractitioners();
