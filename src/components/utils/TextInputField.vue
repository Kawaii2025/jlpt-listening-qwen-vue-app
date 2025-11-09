<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-neutral-700 mb-2">
      {{ label }}
    </label>
    <textarea
      :id="id"
      :value="value"
      @input="$emit('input', $event.target.value)"
      rows="10"
      class="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-lg"
      placeholder="请输入日语文本，例如：
電話で女の学生と男の学生が話しています。男の学生は明日何をしなければなりませんか。
女：もしもし、伊藤君、私田中だけど。明日のサークルのミーティングが急用で出られなくなっちゃったから代わりに仕切ってくれない？
男：はい、わかりました。何か特別に準備することはありますか？"
    ></textarea>
    <p class="mt-1 text-sm text-neutral-500">
      <i class="fa fa-info-circle mr-1"></i> 系统会按句号自动断句，并识别性别标识（如"女："、"男："）
    </p>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: ''
  }
})

defineEmits(['input'])
</script>
