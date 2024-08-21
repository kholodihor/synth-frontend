<template>
  <div class="box">
    <div class="title">
      <SGTitle />
    </div>
    <div class="container">
      <div class="card" v-for="girl in girls" :key="girl.id">
        <div class="imgbox">
          <img :src="girl.image" />
        </div>
        <div class="content">
          <div class="details">
            <h2>
              {{ girl.name }} <br />
              <a :href="girl.url" target="_blank">
                <span>Listen <i class="fa-brands fa-itunes-note"></i></span></a>
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Girl } from "@/types";
import SGTitle from '@/components/decor/SGTitle.vue';
import { useGirlsStore } from '@/stores/girlsStore';

const girls: Girl[] = useGirlsStore().girls;
</script>

<style scoped lang="scss">
.box {
  width: 90%;
  margin: 2rem auto;
  padding: 1rem;

  .title {
    margin-bottom: 1rem;
  }

  .container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .card {
      position: relative;
      width: 16rem;
      height: 22rem;
      background: linear-gradient(90deg, $black, #333);
      margin: 0.8rem;
      border-radius: 1rem;
      overflow: hidden;
      cursor: pointer;

      .imgbox {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 1rem;
        overflow: hidden;
        transition: 0.7s;
        z-index: 10;
        transform-origin: top;

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      &:hover {
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 1),
          0 5px 20px rgba(56, 39, 39, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.2),
          0 0 10px $pink, 0 0 20px $pink;
      }

      &:hover .imgbox {
        transform: translateY(30px) scale(0.5);
      }

      &:hover .content {
        transform: translateY(0);
      }

      .content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        text-align: center;
        padding-bottom: 30px;
        transform: translateY(100%);
        transition: 0.5s;

        .details {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          h2 {
            color: $purple;
            font-size: 2rem;
            font-weight: 500;

            a {
              text-decoration: none;

              span {
                font-size: 1rem;
                font-weight: 400;
                color: $blue;
              }

              &:hover span {
                color: $green;
              }
            }
          }
        }
      }
    }
  }
}
</style>
