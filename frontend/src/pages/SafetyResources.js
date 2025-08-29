import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  Stack,
  Chip,
  Pagination,
  Link,
  Collapse,
  IconButton,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { debounce } from 'lodash';

const API_URL = process.env.REACT_APP_API_URL || '';

const TYPES = ['all', 'article', 'video', 'contact'];
const PAGE_SIZE = 6;

export default function SafetyResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  const [expandedIds, setExpandedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError('');
    async function fetchResources() {
      try {
        const typeFilter = TYPES[tab] === 'all' ? '' : `/${TYPES[tab]}`;
        const res = await axios.get(`${API_URL}/api/resources${typeFilter}`);
        setResources(res.data);
        setExpandedIds([]);
        setPage(1);
      } catch (err) {
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, [tab]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchTerm(value);
        setPage(1);
      }, 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value.toLowerCase().trim());
  };

  const filteredResources = useMemo(() => {
    if (!searchTerm) return resources;
    return resources.filter(
      (r) =>
        r.title.toLowerCase().includes(searchTerm) ||
        r.description.toLowerCase().includes(searchTerm)
    );
  }, [resources, searchTerm]);

  const pageCount = Math.ceil(filteredResources.length / PAGE_SIZE);

  const paginatedResources = filteredResources.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(120deg, #c7d2fe 40%, #fbc2eb 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 4,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        fontWeight={700}
        gutterBottom
        sx={{ mb: 2 }}
      >
        Safety Tips & Resources
      </Typography>

      <Box sx={{ maxWidth: 700, width: '100%', mb: 3, bgcolor: 'transparent' }}>
        <Tabs
          value={tab}
          onChange={(e, val) => setTab(val)}
          textColor="primary"
          indicatorColor="primary"
          centered
          sx={{ "& .MuiTabs-flexContainer": { justifyContent: "center" } }}
        >
          {TYPES.map((type) => (
            <Tab
              key={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              sx={{
                fontWeight: 700,
                fontSize: 16,
                textTransform: 'none',
                paddingBottom: 1,
              }}
            />
          ))}
        </Tabs>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
          {TYPES.slice(1).map((type, idx) => (
            <Chip
              key={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              color={tab === idx + 1 ? 'primary' : 'default'}
              onClick={() => setTab(idx + 1)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: 3,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search resources..."
            size="small"
            onChange={handleSearchChange}
            sx={{
              width: '100%',
              maxWidth: 480,
              borderRadius: 3,
              boxShadow: 2,
            }}
          />
        </Box>
      </Box>

      {loading && (
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && paginatedResources.length === 0 && (
        <Typography align="center" sx={{ mt: 4 }}>
          No resources found.
        </Typography>
      )}

      {!loading && !error && paginatedResources.length > 0 && (
        <Box
          sx={{
            width: '100%',
            maxWidth: 700,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {paginatedResources.map((res) => {
            const isExpanded = expandedIds.includes(res._id);

            if (res.type === 'video') {
              return (
                <Card
                  key={res._id}
                  variant="outlined"
                  sx={{
                    width: '100%',
                    maxWidth: 600,
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1,
                      width: '100%',
                    }}
                  >
                    <VideoLibraryIcon color="secondary" fontSize="large" />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {res.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {res.description}
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      overflow: 'hidden',
                      height: 0,
                      paddingBottom: '56.25%',
                      position: 'relative',
                    }}
                  >
                    <iframe
                      src={res.content}
                      title={res.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '10px',
                        background: '#fff',
                      }}
                    />
                  </Box>
                </Card>
              );
            }
            // Articles & contacts use collapsible panels, centered
            return (
              <Card
                key={res._id}
                variant="outlined"
                sx={{
                  width: '100%',
                  mb: 2,
                  borderRadius: 3,
                  boxShadow: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                  position: 'relative',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {res.type === 'article' && (
                    <ArticleIcon color="primary" fontSize="large" />
                  )}
                  {res.type === 'contact' && (
                    <ContactPhoneIcon color="success" fontSize="large" />
                  )}
                  <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                    {res.title}
                  </Typography>
                  <IconButton
                    aria-label="expand"
                    onClick={() => toggleExpand(res._id)}
                    sx={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2, width: '100%', textAlign: 'left' }}
                >
                  {res.description}
                </Typography>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      mt: 2,
                      width: '95%',
                      mx: 'auto',
                      backgroundColor: '#fff',
                      padding: 2,
                      borderRadius: 1,
                      boxShadow: 6,
                      maxHeight: 240,
                      overflowY: 'auto',
                      boxSizing: 'border-box',
                    }}
                  >
                    {res.type === 'article' && (
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {res.content}
                      </Typography>
                    )}
                    {res.type === 'contact' && (
                      <Box sx={{ whiteSpace: 'pre-line' }}>
                        {res.content.split('\n').map((line, i) => {
                          const phoneMatch = line.match(
                            /(\+?\d{3,}[- ]?\d{3,}[- ]?\d{3,})/
                          );
                          if (phoneMatch) {
                            return (
                              <Typography key={i} variant="body1" sx={{ mb: 0.5 }}>
                                {line.split(phoneMatch[0])[0]}
                                <Link
                                  href={`tel:${phoneMatch[0].replace(/[- ]/g, '')}`}
                                  color="primary"
                                  underline="hover"
                                >
                                  {phoneMatch[0]}
                                </Link>
                                {line.split(phoneMatch[0])[1]}
                              </Typography>
                            );
                          }
                          return (
                            <Typography key={i} variant="body1" sx={{ mb: 0.5 }}>
                              {line}
                            </Typography>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Card>
            );
          })}
        </Box>
      )}

      {!loading && !error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
