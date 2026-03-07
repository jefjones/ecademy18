
import { useContext } from 'react'
import LangContext from '../../context/LangContext'

function PageLanguage(props) {
  const {p, t} = props
        const pageLangs = useContext(LangContext)
        let pageLang = pageLangs && pageLangs.length > 0 && pageLangs.filter(m => m.page === p && m.text === t)[0]
        return (pageLang && pageLang.translation) || t
}

export default PageLanguage
