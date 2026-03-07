import { useEffect } from 'react'
import GalleryAddView from '../views/GalleryAddView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionGalleryList from '../actions/gallery-list'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces } from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)

    return {
        personId: me.personId,
        langCode: me.langCode,
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
    getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
    removeGalleryFileUpload: (personId, fileUploadId) => dispatch(actionGalleryList.removeGalleryFileUpload(personId, fileUploadId)),
    addOrUpdateGalleryFile: (personId, carContact) => dispatch(actionGalleryList.addOrUpdateGalleryFile(personId, carContact)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
    setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
            const {getPageLangs, langCode, setMyVisitedPage, personId} = props
            getPageLangs(personId, langCode, 'GalleryAddView')
            props.location && props.location.pathname && setMyVisitedPage(personId, {path: props.location.pathname, description: `Add Gallery Photo`})
        
  }, [])

  return <GalleryAddView {...props} />
}

export default Container
