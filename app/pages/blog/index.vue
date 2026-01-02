<script setup lang="ts">
definePageMeta({
  layout: 'blog'
})
const { data: page } = await useAsyncData('blog-page', () => {
  return queryCollection('pages').path('/blog').first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}
const { data: posts } = await useAsyncData('blogs', () =>
  queryCollection('blog').order('date', 'DESC').all()
)
if (!posts.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'blogs posts not found',
    fatal: true
  })
}

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description
})
</script>

<template>
  <UPage v-if="page">
    <BlogHeader
      :title="page.title"
      :description="page.description"
    />

    <UPageSection
      class="p-10"
      :ui="{
        container: '!pt-0'
      }"
    >
      <UBlogPosts orientation="vertical">
        <div class="flex flex-col gap-4">
          <BlogPost
            v-for="(post, index) in posts"
            :key="index"
            :post
            :to="post.path"
          />
        </div>
      </UBlogPosts>
    </UPageSection>
  </UPage>
</template>
