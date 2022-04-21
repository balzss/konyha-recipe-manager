import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Chip, CardActionArea, CardActions } from '@mui/material';
import { Recipe, Tag } from '../utils/types';

type RecipeCardProps = {
  recipe: Recipe;
  onClick: (recipeId: string) => void;
};

export default function RecipeCard({
  recipe,
  onClick,
}: RecipeCardProps) {
  const tags: Tag[] = recipe.tags;
  return (
    <Card variant="outlined" sx={{bgcolor: 'background.default'}}>
      <CardActionArea onClick={() => onClick(recipe.slug)}>
        <CardContent>
          <Typography variant="h5" component="div">
            {recipe.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      { tags && tags.length > 0 && (
        <CardActions sx={{px: 2, pb: 2}}>
          {tags.map((tag) => (
            <Chip key={tag.id} label={`${tag.name}`} size="small" onClick={() => console.log(`Tag ID: ${tag.id}`)}/>
          ))}
        </CardActions>
      )}
    </Card>
  );
}
