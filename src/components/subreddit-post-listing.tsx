import React, {useState, useEffect, CSSProperties } from 'react';
import axios from "axios";
import sanitizeHtml from 'sanitize-html';

import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export const SubredditPostListing = () => {

  useEffect(() => {
    // focus on the search field on first render
    document.getElementById('search-subreddits-input')?.focus();

    // set hotkeys for the next, prev and focus on search
    document.addEventListener('keydown', keydown, false);

    // cleanup after component is destroyed
    return () => {
      document.removeEventListener('keydown', keydown, false);
    }
  }, [])

  const keydown = (e: any) => {
    if (e.altKey && e.key === 'n') {
      document.getElementById('next-button-deskop')?.click();
    }
    if (e.altKey && e.key === 'p') {
      document.getElementById('prev-button-desktop')?.click();
    }
    if (e.altKey && e.key === '/') {
      document.getElementById('search-subreddits-input')?.focus();
    }
  }

  // state for the formatted results from the get posts api call
  const [listItems, setListItems] = useState([
    {
      title: '',
      content : '',
      author: '',
      downVotes: 0,
      upVotes: 0,
      commentCount: '',
      id: ''
    }
  ]);

  // state used to determine visibility of messages for api error or no results found
  const [postsCallStatus, setPostsCallStatus] = useState({
    error: false,
    noPostsFound: false
  });

  // state for the search subreddits input box
  const [subredditSearchInputValue, setSubredditSearchInputValue] = useState('');
  
  // states to store the after value and before value from the api call 
  // determines visibility of next/prev buttons - null to hide, string to show
  // used as a param in api call to fetch next or previous posts
  const [afterValue, setAfterValue] = useState(null);
  const [beforeValue, setBeforeValue] = useState(null);
  const [countValue, setCountValue] = useState(0);
  const [showSpinnter, setShowSpinner] = useState(false);

  // makes sure a value is always returned should api properties be missing
  // sanitises any malicious html that might be returned from the api call
  const getSafeValue = (value: any): any => {
    
    let safeValue;

    if (typeof value === 'string') {
      safeValue = (value) ? sanitizeHtml(value) : '';
    } else if (typeof value === 'number') {
      safeValue = (value) ? value : 0;
    }

    return safeValue;

  }

  // creates the struture for the key/value pairs used for rendering api results
  const formatPosts = (subredditPosts: any): void => {
    
    const formattedSubredditPosts = subredditPosts.map((post: any)=> {
  
      const postData = post.data;

      const formattedPost = {
        title: getSafeValue(postData.title),
        content : getSafeValue(postData.selftext),
        author: getSafeValue(postData.author_fullname),
        downVotes: getSafeValue(postData.downs),
        upVotes: getSafeValue(postData.ups),
        commentCount: getSafeValue(postData.num_comments),
        id: getSafeValue(postData.id),
        href: getSafeValue(postData.permalink)
      }  

      return formattedPost;

    });

    setListItems(formattedSubredditPosts);
    
    setPostsCallStatus({
      error: false,
      noPostsFound: false
    });

  }

  // no posts handler
  const handleNoPostsFound = (): void => {

    setPostsCallStatus({
      error: false,
      noPostsFound: true
    });

  }

  // dynamically creates show/hide post toggle functionality 
  const toggleContent = (postId: string) => {

    const contentIdName = `content-id-${postId}`;
    const buttonIdName = `button-id-${postId}`;

    const contentElm = document.getElementById(contentIdName);
    const buttonElm = document.getElementById(buttonIdName);
    
    if (contentElm) {
      contentElm.style.display = (contentElm.style.display === 'none') ? 'block' : 'none';
    }

    if (buttonElm) {
      buttonElm.innerText = (buttonElm.innerText.toUpperCase() === 'SHOW CONTENT') ? 'Hide content' : 'Show content';
    }

  }

  // buttons and empty states for the post content
  const setPostContent = (postId: string, postContent: string) => {

    const defaultContentStyle: CSSProperties = {
      display: 'none'
    }

    const contentIdName = `content-id-${postId}`;
    const buttonIdName = `button-id-${postId}`;

    if (postContent !== '') {

      return (
        
        <div className="content-wrapper">
          <button id={buttonIdName} className="show-content-button" onClick={() => toggleContent(postId)} type="button">
            Show content
          </button>
          <div className="post-content" style={defaultContentStyle} id={contentIdName}>
            {postContent}
          </div>
        </div>

      );

    } else {

      return <div id="content-unavailable">Post has no content</div>

    }

  }

  // output for the results of a post and the empty state if none exist
  const printPostsListing = () => {

    if (postsCallStatus.error || postsCallStatus.noPostsFound) {

      return <li className="posts-status posts-error">No posts were found for your search.</li>

    } else {

      if (listItems.length > 0 && listItems[0].title !== '') {

        return listItems.map((post: any) => {

          const postHref = `https://www.reddit.com${post.href}`;
        
          return (
            <li key={post.id}>
              <Link className="post-title" href={postHref} target="_blank" >
                <h2>{post.title} <FontAwesomeIcon icon={faExternalLinkAlt}></FontAwesomeIcon></h2>
              </Link>
              <div className="post-author"><span className="author-label">Author:</span>{post.author}</div>
              <div className="post-counters-wrapper">
                <FontAwesomeIcon icon={faThumbsUp} />
                <span className="post-counter-label">{post.upVotes}</span>
                <FontAwesomeIcon icon={faThumbsDown} />
                <span className="post-counter-label">{post.downVotes}</span>
                <FontAwesomeIcon icon={faComment} />
                <span className="post-counter-label">{post.commentCount}</span>
              </div>
              {setPostContent(post.id, post.content)}
            </li>
            );

          }

        );
        
      } else {
        return null;
      }
    }

  }

  // search submit handler
  const handleSubmit = (event: React.FormEvent<EventTarget>): void => {

    event.preventDefault();

    if (subredditSearchInputValue !== '') {
      fetchSubredditPosts(false, false);
    }
  
  }

  // saves the state of the search input
  const handleChange = (event: React.FormEvent<EventTarget>): void => {
  
    const target = event.target as HTMLInputElement;

    setSubredditSearchInputValue(sanitizeHtml(target.value));
  
  }

  // api call to retreive the subreddit posts
  // limit is always 10, count is dynmaically calculated based on prev/next
  // after and before values are set from their related states
  const fetchSubredditPosts = async (getNext: boolean, getPrevious: boolean) => {

    let url = '';   
    let newCountValue = 0;

    setShowSpinner(true);

    if (getNext) {
      newCountValue = countValue + 10;
      setCountValue(newCountValue);
      url = `https://www.reddit.com/r/${subredditSearchInputValue}.json?limit=10&count=${newCountValue}&after=${afterValue}`;   
    } else if (getPrevious) {
      newCountValue = countValue - 10;
      setCountValue(newCountValue);
      url = `https://www.reddit.com/r/${subredditSearchInputValue}.json?limit=10&count=${newCountValue}&before=${beforeValue}`;   
    } else {
      newCountValue = countValue + 10;
      setCountValue(newCountValue);
      url = `https://www.reddit.com/r/${subredditSearchInputValue}.json?limit=10`; 
    }

    try {

      const response = await axios.get(url);

      const subredditPosts = response.data.data.children;
      
      setAfterValue(response.data.data.after);
      setBeforeValue(response.data.data.before);

      if (subredditPosts.length > 0) {
        formatPosts(subredditPosts);
      } else {
        handleNoPostsFound();
      }

      setShowSpinner(false);

    } catch (error) {

      setPostsCallStatus({
        error: true,
        noPostsFound: true
      });

      setShowSpinner(false);

    }

  }

  // prints the previous button as well as it's show/hide class
  const printPreviousButton = (type: string) => {
    const buttonClass = (beforeValue) ? 'show-button' : 'hide-button';

    if (postsCallStatus.error || postsCallStatus.noPostsFound) {
      return null;
    } else {
      return <button 
              id={"prev-button-" + type} 
              className={"nav-prev nav-button " + buttonClass} 
              onClick={() => fetchSubredditPosts(false, true)}>
                <div className="arrow-left nav-arrow"></div>
                <span className="nav-button-text">Previous</span>
            </button>;
    }
  }

  // prints the next button as well as it's show/hide class
  const printNextButton = (type: string) => {
    const buttonClass = (afterValue) ? 'show-button' : 'hide-button';

    if (postsCallStatus.error || postsCallStatus.noPostsFound) {
      return null;
    } else {
      return <button 
              id={"next-button-" + type} 
              className={"nav-next nav-button " + buttonClass} 
              onClick={() => fetchSubredditPosts(true, false)}>
                <span className="nav-button-text">Next</span>
                <div className="arrow-right nav-arrow"></div>
            </button>;
    }
  }

  // conditionally prints the loading spinner
  const printSpinner= () => {
    return (showSpinnter) ? <CircularProgress id="search-spinner" color="secondary" /> : null;
  }

  return (
    <div className="search-wrapper">
      <div className="prev-button-col">{printPreviousButton('desktop')}</div>
      <div className="search-card">
        <h1 className="app-title">Subreddit Search</h1>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className="search-field-wrapper">
              <FormControl>
                <TextField id="search-subreddits-input" label="Search Subreddits" value={subredditSearchInputValue} variant="outlined" onChange={handleChange} />
                <FormHelperText id="search-subreddits-helper-text">Enter the title of a subreddit</FormHelperText>
              </FormControl>     
              <Button id="search-button" type="submit" variant="contained" color="primary">
                Search
                <FontAwesomeIcon className="search-icon" icon={faSearch} />
                {printSpinner()}
              </Button>
            </div>
          </form>
        <ul>
          {printPostsListing()}
        </ul>
        <div id="small-screen-nav-buttons" className={(beforeValue || afterValue) ? 'show-small-screen-nav-buttons' : 'hide-small-screen-nav-buttons'}>
          <div className="small-screen-prev-button-wrapper">{printPreviousButton('mobile')}</div>
          <div className="small-screen-next-button-wrapper">{printNextButton('mobile')}</div>
        </div>
      </div>
      <div className="next-button-col">{printNextButton('desktop')}</div>
    </div>
  );

}