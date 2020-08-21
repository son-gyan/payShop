import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import elementTWLocale from 'element-ui/lib/locale/lang/zh-TW' // element-ui lang
import enLocale from './en'
import cnLocale from './cn'
import twLocale from './tw'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  cn: {
    ...cnLocale,
    ...elementZhLocale
  },
  tw: {
    ...twLocale,
    ...elementTWLocale
  }
}

var defaultLang = (
  navigator.language || navigator.browserLanguage
).toLowerCase()
// console.log('navigator.language', defaultLang)
defaultLang = defaultLang.substr(0, 2)
if (defaultLang !== 'zh') {
  defaultLang = 'en'
} else {
  defaultLang = 'cn'
}
// console.log('langIndex', defaultLang)
const i18n = new VueI18n({
  locale: sessionStorage.getItem('language') || defaultLang,
  messages,
  silentTranslationWarn: true
})
sessionStorage.setItem('language', i18n.locale)

export default i18n
