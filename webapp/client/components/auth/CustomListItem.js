import React, {Component} from 'react'
import ListItem from 'material-ui/List/ListItem';

class CustomListItem extends Component {
  constructor(props) {
    super(props);
  }

  get styles() {
    return {
      listSecondarytext: {
        overflow: 'none',
        whiteSpace: 'none',
        margin: '10px 0px'
      }
    }
  }

  render() {
    const {primaryText, secondaryText} = this.props;
    return (
      <ListItem
        primaryText={<div className="list-primary">{primaryText}</div>}
        hoverColor="transparent"
        innerDivStyle={{padding: 12}}
        secondaryTextLines={2}
        secondaryText={
          <p style={this.styles.listSecondarytext}>
            {secondaryText}
          </p>
        }
      />
    )
  }
}

export default CustomListItem
