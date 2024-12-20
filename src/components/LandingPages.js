import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  Twitter as TwitterIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import Layout from './Layout';
import API_URL from '../config';

const LandingPages = () => {
  const [pages, setPages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [newPage, setNewPage] = useState({
    title: '',
    description: '',
    logo: null,
    backgroundImage: null,
    backgroundColor: '#ffffff',
    buttonColor: '#000000',
    buttonTextColor: '#ffffff',
    buttons: [],
    socialLinks: {
      instagram: '',
      facebook: '',
      youtube: '',
      twitter: ''
    }
  });
  const [newButton, setNewButton] = useState({ text: '', url: '' });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/landing-pages`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Fejl ved hentning af landing pages:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved hentning af landing pages',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePage = async () => {
    try {
      const formData = new FormData();
      Object.keys(newPage).forEach(key => {
        if (key === 'logo' || key === 'backgroundImage') {
          if (newPage[key]) formData.append(key, newPage[key]);
        } else if (key === 'buttons' || key === 'socialLinks') {
          formData.append(key, JSON.stringify(newPage[key]));
        } else {
          formData.append(key, newPage[key]);
        }
      });

      const response = await fetch(`${API_URL}/landing-pages`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        setAlert({
          open: true,
          message: 'Landing page oprettet succesfuldt',
          severity: 'success'
        });
        setOpenDialog(false);
        resetNewPage();
        fetchPages();
      }
    } catch (error) {
      console.error('Fejl ved oprettelse af landing page:', error);
      setAlert({
        open: true,
        message: 'Der opstod en fejl ved oprettelse af landing page',
        severity: 'error'
      });
    }
  };

  const resetNewPage = () => {
    setNewPage({
      title: '',
      description: '',
      logo: null,
      backgroundImage: null,
      backgroundColor: '#ffffff',
      buttonColor: '#000000',
      buttonTextColor: '#ffffff',
      buttons: [],
      socialLinks: {
        instagram: '',
        facebook: '',
        youtube: '',
        twitter: ''
      }
    });
  };

  const handleAddButton = () => {
    if (newButton.text && newButton.url) {
      setNewPage(prev => ({
        ...prev,
        buttons: [...prev.buttons, { ...newButton }]
      }));
      setNewButton({ text: '', url: '' });
    }
  };

  const handleRemoveButton = (index) => {
    setNewPage(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (event, field) => {
    const file = event.target.files[0];
    setNewPage(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setNewPage(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleDeletePage = async (id) => {
    if (window.confirm('Er du sikker på, at du vil slette denne landing page?')) {
      try {
        const response = await fetch(`${API_URL}/landing-pages/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          setAlert({
            open: true,
            message: 'Landing page slettet succesfuldt',
            severity: 'success'
          });
          fetchPages();
        }
      } catch (error) {
        console.error('Fejl ved sletning af landing page:', error);
        setAlert({
          open: true,
          message: 'Der opstod en fejl ved sletning af landing page',
          severity: 'error'
        });
      }
    }
  };

  // Live Preview Component
  const LivePreview = () => (
    <Box
      sx={{
        height: '100%',
        backgroundColor: newPage.backgroundColor,
        backgroundImage: newPage.backgroundImage ? `url(${URL.createObjectURL(newPage.backgroundImage)})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 3,
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {newPage.logo && (
        <Box
          component="img"
          src={URL.createObjectURL(newPage.logo)}
          alt="Logo"
          sx={{
            width: 'auto',
            maxWidth: '150px',
            height: 'auto',
            maxHeight: '150px',
            marginBottom: 2
          }}
        />
      )}

      <Typography
        variant="h5"
        sx={{
          color: newPage.buttonTextColor,
          textAlign: 'center',
          marginBottom: 2
        }}
      >
        {newPage.title || 'Din titel her'}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: newPage.buttonTextColor,
          textAlign: 'center',
          marginBottom: 3
        }}
      >
        {newPage.description || 'Din beskrivelse her'}
      </Typography>

      <Stack spacing={2} sx={{ width: '100%', maxWidth: '300px' }}>
        {newPage.buttons.map((button, index) => (
          <Button
            key={index}
            variant="contained"
            sx={{
              backgroundColor: newPage.buttonColor,
              color: newPage.buttonTextColor,
              '&:hover': {
                backgroundColor: newPage.buttonColor,
                opacity: 0.9
              }
            }}
          >
            {button.text}
          </Button>
        ))}
      </Stack>

      <Box sx={{ marginTop: 'auto', display: 'flex', gap: 2 }}>
        {Object.entries(newPage.socialLinks).map(([platform, url]) => {
          if (!url) return null;
          const Icon = {
            instagram: InstagramIcon,
            facebook: FacebookIcon,
            youtube: YouTubeIcon,
            twitter: TwitterIcon
          }[platform];
          return (
            <IconButton
              key={platform}
              sx={{ color: newPage.buttonColor }}
            >
              <Icon />
            </IconButton>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Layout title="Landing Pages">
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1">
                Landing Pages
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Opret ny landing page
              </Button>
            </Box>
          </Grid>

          {isLoading ? (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            </Grid>
          ) : pages.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  Ingen landing pages oprettet endnu
                </Typography>
              </Paper>
            </Grid>
          ) : (
            pages.map(page => (
              <Grid item xs={12} sm={6} md={4} key={page._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={page.backgroundImage || '/placeholder.jpg'}
                    alt={page.title}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {page.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {page.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => setSelectedPage(page)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePage(page._id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton href={`/landing/${page._id}`} target="_blank">
                      <PreviewIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Opret ny landing page</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Venstre side - Indstillinger */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Titel"
                    value={newPage.title}
                    onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Beskrivelse"
                    multiline
                    rows={4}
                    value={newPage.description}
                    onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    fullWidth
                  >
                    Upload Logo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'logo')}
                    />
                  </Button>
                  {newPage.logo && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Valgt fil: {newPage.logo.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon />}
                    fullWidth
                  >
                    Upload Baggrundsbillede
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'backgroundImage')}
                    />
                  </Button>
                  {newPage.backgroundImage && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Valgt fil: {newPage.backgroundImage.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel shrink>Baggrundsfarve</InputLabel>
                    <input
                      type="color"
                      value={newPage.backgroundColor}
                      onChange={(e) => setNewPage({ ...newPage, backgroundColor: e.target.value })}
                      style={{ width: '100%', height: '56px', marginTop: '16px' }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel shrink>Knapfarve</InputLabel>
                    <input
                      type="color"
                      value={newPage.buttonColor}
                      onChange={(e) => setNewPage({ ...newPage, buttonColor: e.target.value })}
                      style={{ width: '100%', height: '56px', marginTop: '16px' }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel shrink>Knap tekstfarve</InputLabel>
                    <input
                      type="color"
                      value={newPage.buttonTextColor}
                      onChange={(e) => setNewPage({ ...newPage, buttonTextColor: e.target.value })}
                      style={{ width: '100%', height: '56px', marginTop: '16px' }}
                    />
                  </FormControl>
                </Grid>

                {/* Links sektion */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Tilføj Links
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Link tekst"
                        value={newButton.text}
                        onChange={(e) => setNewButton({ ...newButton, text: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="URL"
                        value={newButton.url}
                        onChange={(e) => setNewButton({ ...newButton, url: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddButton}
                        disabled={!newButton.text || !newButton.url}
                      >
                        Tilføj Link
                      </Button>
                    </Grid>
                  </Grid>

                  <List>
                    {newPage.buttons.map((button, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={button.text}
                          secondary={button.url}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => handleRemoveButton(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                {/* Sociale medier sektion */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Sociale Medier
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Instagram URL"
                        value={newPage.socialLinks.instagram}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        InputProps={{
                          startAdornment: <InstagramIcon sx={{ mr: 1 }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Facebook URL"
                        value={newPage.socialLinks.facebook}
                        onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                        InputProps={{
                          startAdornment: <FacebookIcon sx={{ mr: 1 }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="YouTube URL"
                        value={newPage.socialLinks.youtube}
                        onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                        InputProps={{
                          startAdornment: <YouTubeIcon sx={{ mr: 1 }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Twitter URL"
                        value={newPage.socialLinks.twitter}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        InputProps={{
                          startAdornment: <TwitterIcon sx={{ mr: 1 }} />
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Højre side - Live Preview */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  height: '700px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  Live Preview
                </Typography>
                <Box sx={{ height: 'calc(100% - 48px)', overflow: 'auto' }}>
                  <LivePreview />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            resetNewPage();
          }}>
            Annuller
          </Button>
          <Button
            onClick={handleCreatePage}
            variant="contained"
            color="primary"
            disabled={!newPage.title || !newPage.description}
          >
            Opret
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default LandingPages; 