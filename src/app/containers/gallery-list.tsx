import { useEffect, useState } from 'react'
import GalleryListView from '../views/GalleryListView'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import * as actionPageLang from '../actions/language-list'
import * as actionGalleryList from '../actions/gallery-list'
import * as actionMyFrequentPlaces from '../actions/my-frequent-places'
import * as actionMyVisitedPages from '../actions/my-visited-pages'
import { selectMe, selectMyFrequentPlaces, selectGalleryList, selectAccessRoles, selectStudents, selectFetchingRecord, selectPersonConfig,} from '../store'

const mapStateToProps = (state, props) => {
    let me = selectMe(state)
    let students = selectStudents(state)
    let galleryList = selectGalleryList(state)
    if (galleryList && galleryList.length > 0) {
        students = students && students.length > 0 && students.filter(s => {
            let found = false
            galleryList.forEach(g => {
                g.peopleInPicture && g.peopleInPicture.length > 0 && g.peopleInPicture.forEach(p => {
                    if (p.personId === s.personId) found = true
                })
            })
            return found
        })
    }

    return {
        personId: me.personId,
        langCode: me.langCode,
        students,
				galleryList,
				accessRoles: selectAccessRoles(state),
				fetchingRecord: selectFetchingRecord(state),
				personConfig: selectPersonConfig(state),
				myFrequentPlaces: selectMyFrequentPlaces(state),
    }
}

const bindActionsToDispatch = dispatch => ({
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
		getGalleryList: (personId) => dispatch(actionGalleryList.getGalleryList(personId)),
		setMyFrequentPlace: (personId, myFrequentPlace, isHomeChoice) => dispatch(actionMyFrequentPlaces.setMyFrequentPlace(personId, myFrequentPlace, isHomeChoice)),
		setMyVisitedPage: (personId, myVisitedPage) => dispatch(actionMyVisitedPages.setMyVisitedPage(personId, myVisitedPage)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps), shallowEqual)
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    
    		    const {getPageLangs, langCode, personId, getGalleryList} = props
    		    getPageLangs(personId, langCode, 'GalleryListView')
    				getGalleryList(personId)
    	  
  }, [])

  return <GalleryListView {...props} />
}


export default Container
