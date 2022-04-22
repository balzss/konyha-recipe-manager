import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  OutlinedInput,
  ListItemText,
  Checkbox,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  TextField,
  Container,
  Select,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Close as CloseIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import TopBar from '../components/TopBar';
import ConfirmModal from '../components/ConfirmModal';
import { Recipe, Tag } from '../utils/types';
import { useSingleRecipe, useTags } from '../dataHooks';

type RequiredFields = {
  recipeName: string;
  ingredients: string;
  instructions: string;
};

function getMissingFields({recipeName, ingredients, instructions}: RequiredFields) {
  return [
    ...recipeName?.trim() ? [] : ['recipeName'],
    ...ingredients?.trim() ? [] : ['ingredients'],
    ...instructions?.trim() ? [] : ['instructions'],
  ];
}

const EditRecipePage: NextPage = () => {
  const router = useRouter();
  const { recipeSlug } = router.query;
  const { data: recipe } = useSingleRecipe(recipeSlug as string);
  const { data: tags } = useTags();

  const [recipeName, setRecipeName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [ingredients, setIngredients] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>('');
  const [missingFields, setMissingFields] = useState<boolean>(true); // TODO use for save button
  const [saveConfirmOpen, setSaveConfirmOpen] = useState<boolean>(false);

  useEffect(() => {
    if (recipe && tags && tags.length) {
      setRecipeName(recipe.name);
      setIngredients(recipe.ingredients?.join('\n'));
      setInstructions(recipe.instructions?.join('\n'));
      setSelectedTags(recipe.tags.map((tagId) => tags.find(tag => tag.id === tagId.id)?.name) as string[]);
      if (recipe.description) {
        setDescription(recipe.description);
      }
    }
  }, [recipe, tags]);

  useEffect(() => {
    setMissingFields(!!getMissingFields({recipeName, ingredients, instructions}).length);
  }, [recipeName, ingredients, instructions]);

  const getTagByName = (tagName: string) => {
    return tags?.find((tag) => tag.name === tagName)?.name;
  };

  const getTagIdByName = (tagName: string): string | undefined => {
    return tags?.find((tag) => tag.name === tagName)?.id;
  };

  const handleSubmitRecipe = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const newRecipeData = {
      recipeName,
      description,
      ingredients,
      instructions,
      tags: selectedTags.map(getTagIdByName) as string[],
      newTag,
    };
    console.log({newRecipeData})

    // let recipeSlug = '';
    // try {
    //   if (params.recipeSlug) {
    //     const editResponse = await dispatch(editRecipe({updatedRecipe: newRecipeData, recipeId: recipe.id})).unwrap();
    //     recipeSlug = editResponse.slug;
    //   } else {
    //     const addResponse = await dispatch(addRecipe(newRecipeData)).unwrap();
    //     recipeSlug = addResponse.slug;
    //   }
    //   // re-fetching the tags in case there were new ones created
    //   await dispatch(fetchTags()).unwrap();
    // } catch (e) {
    //   // TODO handle error response
    //   console.error(e);
    // } finally {
    // router.push('/');
    // }
  };

  const handleTagChange = (event: SelectChangeEvent<typeof selectedTags>) => {
    setSelectedTags(event.target.value as string[]);
  };

  const handleClickBack = (_e: React.SyntheticEvent) => {
    router.push('/');
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100%',
        paddingTop: '80px',
      }}
    >
      <TopBar
        leadingAction={{action: handleClickBack, icon: <CloseIcon/>, label: 'Vissza'}}
        title={recipeSlug ? 'Recept szerkesztése' : 'Új recept'}
        trailingActions={[
          {icon: <SaveIcon/>, action: () => setSaveConfirmOpen(true), label: 'Mentés'},
        ]}
        hiddenActions={[]}
      />
      <ConfirmModal
        open={saveConfirmOpen}
        title={'Mentés'}
        desription={'Biztosan mented a receptet?'}
        handleClose={() => setSaveConfirmOpen(false)}
        handleConfirm={handleSubmitRecipe}
        confirmText={'Mentés'}
      />
      <Container maxWidth="sm">
        <form onSubmit={handleSubmitRecipe}>
          <TextField 
            label="Recept neve"
            variant="outlined"
            margin="normal"
            required
            sx={{width: '100%'}}
            value={recipeName}
            onChange={({target}) => setRecipeName(target.value)}
          />
          <TextField
            label="Leírás"
            variant="outlined"
            margin="normal"
            multiline
            minRows={2}
            sx={{width: '100%'}}
            value={description}
            onChange={({target}) => setDescription(target.value)}
          />
          <TextField
            label="Hozzávalók"
            variant="outlined"
            margin="normal"
            required
            multiline
            minRows={4}
            sx={{width: '100%'}}
            value={ingredients}
            onChange={({target}) => setIngredients(target.value)}
          />
          <TextField
            label="Elkészítés"
            variant="outlined"
            margin="normal"
            required
            multiline
            minRows={4}
            sx={{width: '100%'}}
            value={instructions}
            onChange={({target}) => setInstructions(target.value)}
          />
          <FormControl margin="normal" sx={{ width: "100%" }}>
            <InputLabel id="tag-select-label">Mentett címkék</InputLabel>
            <Select
              labelId="tag-select-label"
              multiple
              value={selectedTags.map((selectedTag) => getTagByName(selectedTag) as string)}
              onChange={handleTagChange}
              input={<OutlinedInput label="Mentett címkék" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {tags && tags.length > 0 && tags.map(({name}) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={selectedTags.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField 
            label="Új címkék"
            variant="outlined"
            margin="normal"
            sx={{width: '100%'}}
            value={newTag}
            onChange={({target}) => setNewTag(target.value)}
          />
        </form>
      </Container>
    </Box>
  );
};

export default EditRecipePage;
