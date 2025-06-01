import React, { useRef, useState, useReducer, useEffect } from 'react';
import TaskBar from './TaskBar';
import Toolbar from './ToolBar';
import AnnotationList from './AnnotationList';
// import AnnotationService from './annotationService.js';
import './styles.css';
import VideoPlayer from './Video';

const initialState = {
  annotations: [],
  selected: null,
  tool: 'select',
  color: '#ffffff',
  annotDuration: "2.00",
  undoStack: [],
  redoStack: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ANNOTATION':
      return {
        ...state,
        undoStack: [...state.undoStack, state.annotations],
        annotations: [...state.annotations, action.payload],
        redoStack: [],
        selected: action.payload, // Optional: auto-select new annotation
      };

    case 'LOAD_ANNOTATIONS':
      return {
        ...state,
        annotations: action.payload,
        undoStack: [],
        redoStack: [],
        selected: null,
      };

    case 'UPDATE_ANNOTATION':
      return {
        ...state,
        undoStack: [...state.undoStack, state.annotations],
        annotations: state.annotations.map(annot =>
          annot.id === action.payload.id
            ? { ...annot, ...action.payload.updates }
            : annot
        ),
        redoStack: [],
      };

    case 'DELETE_ANNOTATION':
      return {
        ...state,
        undoStack: [...state.undoStack, state.annotations],
        annotations: state.annotations.filter(annot => annot.id !== action.payload),
        redoStack: [],
        selected: state.selected?.id === action.payload ? null : state.selected,
      };

    case 'SET_ANNOT_TIME':
      return { ...state, annotDuration: action.payload };

    case 'SET_COLOR':
      return { ...state, color: action.payload };

    case 'SET_SELECTED':
      return { ...state, selected: action.payload };

    case 'SET_TOOL':
      return { ...state, tool: action.payload };

    case 'UNDO':
      if (state.undoStack.length === 0) return state;
      const previous = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        redoStack: [...state.redoStack, state.annotations],
        annotations: previous,
        undoStack: state.undoStack.slice(0, -1),
        selected: null,
      };

    case 'REDO':
      if (state.redoStack.length === 0) return state;
      const next = state.redoStack[state.redoStack.length - 1];
      return {
        ...state,
        undoStack: [...state.undoStack, state.annotations],
        annotations: next,
        redoStack: state.redoStack.slice(0, -1),
        selected: null,
      };

    default:
      return state;
  }
}

export default function MainComponent() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="app-container">
      <div className="sidebar-left">
        <AnnotationList annotations={state.annotations}/>
      </div>
      <div className="video-container">
        <VideoPlayer dispatch={dispatch} state={state} />
        <TaskBar />
      </div>
      <div className="sidebar-right">
        <Toolbar dispatch={dispatch} state={state} />
      </div>
    </div>
  );
}