<template>
  <div class="container">
    <div class="header">
      <h1 class="title">ASCII - PET</h1>
    </div>

    <div class="display-card">
      <el-icon v-if="savedAscii || savedDescription" class="delete-icon" @click="deletePet">
        <Delete />
      </el-icon>
      <div class="label">ASCII - картинка</div>
      <div class="ascii-display">
        <pre>{{ savedAscii || '.........／＞　 フ...........\n　　　　　| 　_　 _|\n　 　　　／ミ _x 彡\n　　 　 /　　　 　 |\n　　　 /　 ヽ　　 ﾉ\n　／￣|　　 |　|　|\n　| (￣ヽ＿_ヽ_)_)\n　＼二つ' }}</pre>
        <el-icon v-if="savedAscii" class="copy-icon" @click="copyText(savedAscii)">
          <CopyDocument />
        </el-icon>
      </div>

      <div class="label">Описание питомца</div>
      <div class="description-display">
        <span>{{ savedDescription || 'Это грустный котик - Степик\nПочему он грустный?\nПотому что тут нету картинки и описания...' }}</span>
        <el-icon v-if="savedDescription" class="copy-icon" @click="copyText(savedDescription)">
          <CopyDocument />
        </el-icon>
      </div>
    </div>

    <div class="form-card">
      <textarea
          v-model="asciiArt"
          class="ascii-input"
          placeholder="Вставьте сюда вашу ASCII картинку..."
          rows="8"
      ></textarea>

      <textarea
          v-model="description"
          class="description-input"
          placeholder="Описание питомца..."
          rows="2"
      ></textarea>

      <!-- Переключатель валидации -->
      <div style="margin: 10px 0;">
        <el-switch
            v-model="strictValidation"
            active-text="Строгая валидация(0-127 символов)"
            inactive-text="Гибкая валидация(для арт ASCII)"
        />
      </div>

      <el-button type="primary" class="save-button" @click="savePet">Сохранить</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { CopyDocument, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { getPet, savePet as apiSavePet, deletePet as apiDeletePet } from "./api/petApi.js";

const asciiArt = ref('');
const description = ref('');
const savedAscii = ref('');
const savedDescription = ref('');
const strictValidation = ref(true);
const isLoading = ref(false); // Добавим индикатор загрузки

// Валидация ASCII
const isValidAscii = (input) => strictValidation.value
    ? /^[\x20-\x7E\n]*$/.test(input)
    : /^[\p{L}\p{N}\p{P}\p{S}\p{Z}\n\r\t]*$/u.test(input);

// Проверка длины текста
const validateLength = (text, maxLength, fieldName) => {
  if (!text) {
    ElMessage.error(`Введите ${fieldName}!`);
    return false;
  }
  if (text.length > maxLength) {
    ElMessage.error(`${fieldName} не должен превышать ${maxLength} символов!`);
    return false;
  }
  return true;
};

// Сохранение питомца
const savePet = async () => {
  if (!validateLength(asciiArt.value, 30000, 'ASCII картинка') ||
      !validateLength(description.value, 3000, 'описание')) {
    return;
  }

  if (!isValidAscii(asciiArt.value)) {
    ElMessage.error(strictValidation.value
        ? 'ASCII картинка содержит недопустимые символы!'
        : 'Картинка содержит непечатные символы!');
    return;
  }

  try {
    isLoading.value = true;
    await apiSavePet({
      ascii: asciiArt.value,
      description: description.value
    });

    ElMessage.success('Питомец сохранён!');
    savedAscii.value = asciiArt.value;
    savedDescription.value = description.value;
    asciiArt.value = '';
    description.value = '';
  } catch (error) {
    ElMessage.error(error.response?.data?.message || error.message || 'Ошибка сохранения');
  } finally {
    isLoading.value = false;
  }
};

// Копирование текста
const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success('Текст скопирован!');
  } catch {
    ElMessage.error('Не удалось скопировать');
  }
};

// Загрузка питомца
const loadPet = async () => {
  try {
    isLoading.value = true;
    const data = await getPet();
    savedAscii.value = data?.ascii || '';
    savedDescription.value = data?.description || '';
  } catch (error) {
    if (error.response?.status !== 204) {
      console.error('Ошибка загрузки:', error);
    }
  } finally {
    isLoading.value = false;
  }
};

// Удаление питомца
const deletePet = async () => {
  try {
    isLoading.value = true;
    await apiDeletePet();
    ElMessage.success('Питомец удалён!');
    savedAscii.value = '';
    savedDescription.value = '';
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Ошибка удаления');
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadPet);
</script>
