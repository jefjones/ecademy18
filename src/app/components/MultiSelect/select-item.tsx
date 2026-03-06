// @flow
/**
 * This component represents an individual item in the multi-select drop-down
 */
import { Component } from 'react'

export type Option = {
    value: any,
    label: string,
}

const styles = {
    itemContainer: {
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        color: '#666666',
        cursor: 'pointer',
        display: 'block',
        padding: '8px 10px',
    },
    itemContainerHover: {
        backgroundColor: '#ebf5ff',
        outline: 0,
    },
    alignChildren: {
        alignChildren: 'middle',
    },
    label: {
        display: 'inline-block',
        cursor: 'default',
        position: 'relative',
        top: '-2px',
        marginLeft: '5px',
        marginBottom: '3px',
    },
    checkbox: {
      marginTop: '4px',
      marginRight: '4px',
    }
}

function DefaultItemRenderer(props) {
  const {checked, option, onClick} = props
  
          return <span className={styles.alignChildren}>
              <input
                  type="checkbox"
                  onChange={() => {}}
                  onClick={onClick}
                  checked={checked}
                  tabIndex="-1"
                  style={{position: 'relative', top: '4px', marginRight: '4px'}}
              />
              <span>
                  {option.label}
              </span>
          </span>
}

function SelectItem(props) {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    
            updateFocus()
        
  }, [])

  // TODO: verify useEffect deps (converted from componentDidUpdate)
  useEffect(() => {
    
            updateFocus()
        
  }, [])

  const onChecked = (e: {target: {checked: boolean}}) => {
    
            const {onSelectionChanged} = props
            const {checked} = e.target
    
            onSelectionChanged(checked)
        
  }

  const toggleChecked = () => {
    
            const {checked, onSelectionChanged} = props
            onSelectionChanged(!checked)
        
  }

  const handleClick = (e: MouseEvent) => {
    
            const {onClick} = props
            toggleChecked()
            onClick(e)
    
            e.preventDefault()
        
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    
            switch (e.which) {
                case 13: // Enter
                case 32: // Space
                    toggleChecked()
                    break
                default:
                    return
            }
    
            e.preventDefault()
        
  }

  const {ItemRenderer, option, checked, focused} = props
          
  
          const focusStyle = (focused || hovered)
              ? styles.itemContainerHover
              : undefined
  
          return <label
              role="option"
              aria-selected={checked}
              selected={checked}
              tabIndex="-1"
              style={{...styles.itemContainer, ...focusStyle}}
              onClick={handleClick}
              ref={ref => itemRef = ref}
              onKeyDown={handleKeyDown}
              onMouseOver={() => setHovered(true)}
              onMouseOut={() => setHovered(false)}
          >
              <ItemRenderer
                  option={option}
                  checked={checked}
                  onClick={handleClick}
              />
          </label>
}



export default SelectItem
