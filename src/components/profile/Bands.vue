<template>
  <div class="bands-section">
    <div class="section-header">
      <h1>My Favourite Bands</h1>
      <div class="buttons-wrapper" v-if="userStore._id == route.params.id">
        <LinkBtn text="Add Band" url="/account/add-band">
          <i class="fas fa-plus"></i>
          Add Band
        </LinkBtn>
      </div>
    </div>
    <div class="divider"></div>
    <div class="bands-grid">
      <div v-if="bands.length" class="bands-items">
        <Card v-for="band in bands" :key="band._id" :band="band" />
      </div>
      <div v-else class="no-bands">
        <i class="fas fa-users"></i>
        <p>No bands added yet</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Band, User } from '@/types'
import { useRoute } from 'vue-router'
import LinkBtn from '@/components/shared/LinkBtn.vue'
import Card from '@/components/shared/Card.vue'

const route = useRoute()

defineProps<{
  bands: Band[]
  userStore: User
}>()
</script>

<style scoped lang="scss">
.bands-section {
  width: 100%;
  padding: 2rem;
  background: $black;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba($dark, 0.5);
  border: 1px solid rgba($blue, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }

  h1 {
    font-size: 2.5rem;
    color: $white;
    text-shadow: 0 0 10px rgba($blue, 0.5);

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }
}

.buttons-wrapper {
  display: flex;
  gap: 1rem;
  align-items: center;

  :deep(.btn) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba($blue, 0.2);
    border: 1px solid rgba($blue, 0.3);
    border-radius: 0.5rem;
    color: $white;
    transition: all 0.3s ease;

    &:hover {
      background: rgba($blue, 0.3);
      transform: translateY(-2px);
    }

    i {
      font-size: 1.2rem;
    }
  }
}

.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba($blue, 0.3), transparent);
  margin: 1rem 0;
}

.bands-grid {
  margin-top: 2rem;
}

.bands-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.no-bands {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: rgba($white, 0.7);

  i {
    font-size: 3rem;
    color: $blue;
  }

  p {
    font-size: 1.2rem;
  }
}
</style>
