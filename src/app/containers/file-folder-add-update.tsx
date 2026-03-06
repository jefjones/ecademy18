import { useEffect } from 'react'
import FileFolderAddUpdateView from '../views/FileFolderAddUpdateView'
import { useSelector, useDispatch } from 'react-redux'
import * as actionWorks from '../actions/works'
import * as actionPageLang from '../actions/language-list'
import {doSort} from '../utils/sort'

import { selectMe, selectMyWorksFileTreeExplorer } from '../store'

let workFolder = null
let fileFolderList = null

const findWorkFolder = (workFolderId, fileTreeExplorer) => {
		if (!workFolder && fileTreeExplorer && fileTreeExplorer.length > 0) {
				fileTreeExplorer.forEach(m => {
						if (m.workFolderId) {
								if (m.workFolederId === workFolderId) {
										workFolder = m
								}
						}
						if (m.subContents && m.subContents.length > 0) findWorkFolder(workFolderId, m.subContents)
				})
		}
}

const fillFileFolderList = (fileTreeExplorer) => {
		if (fileTreeExplorer && fileTreeExplorer.length > 0) {
				fileTreeExplorer.forEach(m => {
						if (m.workFolderId) {
								let option = [{id: m.folderWorkId, label: m.folderName }]
								fileFolderList = findWorkFolder ? findWorkFolder.concat(option) : option
						}
						if (m.subContents && m.subContents.length > 0) fillFileFolderList(m.subContents)
				})
		}
}


// takes values from the redux store and maps them to props
const mapStateToProps = (state, props) => {
    let me = selectMe(state)
		let parentWorkFolderId = props.params && props.params.parentWorkFolderId
		let workFolderId = props.params && props.params.workFolderId
		let fileTreeExplorer = selectMyWorksFileTreeExplorer(state)
		let workFolder = workFolderId && findWorkFolder(workFolderId, fileTreeExplorer)

		fileFolderList = fillFileFolderList(fileTreeExplorer)
		fileFolderList = doSort(fileFolderList, {sortField: 'folderName', isAsc: true, isNumber: false})

    return {
        personId: me.personId,
				langCode: me.langCode,
				parentWorkFolderId,
				workFolderId,
				workFolder,
				mineOrOthers: props.params && props.params.mineOrOthers,
    }
}

// binds the result of action creators to redux dispatch, wrapped in callable functions
const bindActionsToDispatch = dispatch => ({
    addOrUpdateFolder: (workFolder) => dispatch(actionWorks.addOrUpdateFolder(workFolder)),
		getPageLangs: (personId, langCode, page) => dispatch(actionPageLang.getPageLangs(personId, langCode, page)),
})


function Container(ownProps) {
  const dispatch = useDispatch()
  const storeData = useSelector(state => mapStateToProps(state, ownProps))
  const storeActions = bindActionsToDispatch(dispatch)
  const props = { ...ownProps, ...storeData, ...storeActions }

  useEffect(() => {
    
    		const {personId, langCode, getPageLangs} = props
    		getPageLangs(personId, langCode, 'FileFolderAddUpdateView')
    	
  }, [])

  return <FileFolderAddUpdateView {...props} />
}

export default Container
