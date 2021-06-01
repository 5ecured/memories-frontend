import React, { useState, useEffect } from 'react'
import { TextField, Button, Typography, Paper } from '@material-ui/core'
import FileBase from 'react-file-base64'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import useStyles from './styles'
import { createPost, updatePost } from '../../actions/posts'

function Form({ currentId, setCurrentId }) {
    const [postData, setPostdata] = useState({
        title: '',
        message: '',
        tags: '',
        selectedFile: ''
    })

    const post = useSelector(state => currentId ? state.posts.posts.find(message => message._id === currentId) : null)
    const history = useHistory()
    const classes = useStyles()
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('profile'))

    useEffect(() => {
        if (post) setPostdata(post)
    }, [post])

    const handleSubmit = e => {
        e.preventDefault()

        if (currentId === 0) {
            dispatch(createPost({ ...postData, name: user?.result?.name }, history))
        } else {
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }))
        }
        clear()
    }

    if (!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant='h6' align='center'>
                    Please sign in to create your own memories and like others' memories
                </Typography>
            </Paper>
        )
    }

    const clear = () => {
        setCurrentId(0);
        setPostdata({ title: '', message: '', tags: '', selectedFile: '' });
    };

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete='off' noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant='h6'>
                    {currentId ? 'Updating' : 'Creating'} a Memory
                </Typography>
                {/* <TextField
                    name='creator'
                    variant='outlined'
                    label='Creator'
                    fullWidth
                    value={postData.creator}
                    onChange={e => setPostdata({ ...postData, creator: e.target.value })}
                /> */}
                <TextField
                    name='title'
                    variant='outlined'
                    label='Title'
                    fullWidth
                    value={postData.title}
                    onChange={e => setPostdata({ ...postData, title: e.target.value })}
                />
                <TextField
                    name='message'
                    variant='outlined'
                    label='Message'
                    fullWidth
                    value={postData.message}
                    onChange={e => setPostdata({ ...postData, message: e.target.value })}
                />
                <TextField
                    name='tags'
                    variant='outlined'
                    label='Tags'
                    fullWidth
                    value={postData.tags}
                    onChange={e => setPostdata({ ...postData, tags: e.target.value.split(',') })}
                />
                <div className={classes.fileInput}>
                    <FileBase
                        type='file'
                        multiple={false}
                        onDone={({ base64 }) => setPostdata({ ...postData, selectedFile: base64 })}
                    />
                </div>
                <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth>Submit</Button>
                <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper>
    )
}

export default Form
