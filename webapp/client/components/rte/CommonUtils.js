import React from 'react';

export const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();

  const styles = {
    link: {
      color: '#3b5998',
      textDecoration: 'underline',
    }
  };

  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};

export function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}
