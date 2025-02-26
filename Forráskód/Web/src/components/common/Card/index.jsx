import React from 'react';
import {
  Card as MuiCard,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  styled,
} from '@mui/material';
import PropTypes from 'prop-types';

const StyledCard = styled(MuiCard)(({ theme, elevation }) => ({
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  boxShadow: elevation ? theme.shadows[elevation] : theme.shadows[1],
  '&:hover': {
    boxShadow: elevation ? theme.shadows[elevation + 1] : theme.shadows[2],
  },
}));

const Card = ({
  title,
  subheader,
  avatar,
  action,
  image,
  imageAlt,
  imageHeight,
  content,
  children,
  actions,
  elevation = 1,
  onClick,
  ...rest
}) => {
  return (
    <StyledCard elevation={elevation} onClick={onClick} {...rest}>
      {(title || subheader || avatar || action) && (
        <CardHeader
          title={title}
          subheader={subheader}
          avatar={avatar}
          action={action}
        />
      )}
      
      {image && (
        <CardMedia
          component="img"
          height={imageHeight || 200}
          image={image}
          alt={imageAlt || title || 'kép'}
        />
      )}
      
      {(content || children) && (
        <CardContent>
          {typeof content === 'string' ? (
            <Typography variant="body2" color="text.secondary">
              {content}
            </Typography>
          ) : (
            content
          )}
          {children}
        </CardContent>
      )}
      
      {actions && <CardActions>{actions}</CardActions>}
    </StyledCard>
  );
};

Card.propTypes = {
  title: PropTypes.node,
  subheader: PropTypes.node,
  avatar: PropTypes.node,
  action: PropTypes.node,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  imageHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  content: PropTypes.node,
  children: PropTypes.node,
  actions: PropTypes.node,
  elevation: PropTypes.number,
  onClick: PropTypes.func,
};

export default Card; 