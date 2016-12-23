/** @jsx h */
import './index.html';
import './index.css';
import {h, Cream, create, _container } from '../../../';

create({
  element : document.body,
  createRoot : false
})
.route('/', 'todomvc')
.route('/:filter', 'todomvc');

Cream.extend({
  _namespace : 'todomvc',

  todosStore : [
    {
      title : 'Taste Javascript',
      complete : true,
    },
    {
      title : 'Buy a unicorn',
      complete : false
    }
  ],

  completeAll : function(e) {
    this.get('todosStore').map((t, i) => 
        this.set('todosStore.'+ i +'.complete', e.target.checked));
  },

  clearCompleted : function() {
    this.set('todosStore', this.get('todosStore').filter( todo => todo.complete === false ));
  },

  itemsLeft : function() {
    return this.get('todosStore').filter( t => t.complete === false ).length;
  }.property(),

  completeTodo : function(idx) {
    this.set('todosStore.' + idx + '.complete',
      !this.get('todosStore.' + idx + '.complete'));
  },

  removeTodo : function(idx) {
    this.splice('todosStore', idx, 1);
  },

  insertTodo : function(e) {
    if (e.keyCode !== 13 || e.target.value.length < 1) {
      return;
    }

    this.unshift('todosStore', { title : e.target.value, complete : false });
    e.target.value = '';
  },

  untoggleEditings : function(e) {
    if (e && e.target.tagName !== 'INPUT') {
      this.set('todosStore', this.get('todosStore').map( t => { t.editing = false; return t; }));
    }
  },

  toggleEditing : function(idx) {
    this.untoggleEditings();
    this.set('todosStore.' + idx + '.editing', !this.get('todosStore.' + idx + '.editing'));
  },

  editTodo : function(idx, e) {
    if (e.keyCode !== 13 || e.target.value.length < 1) {
      return;
    }

    this.set('todosStore.' + idx + '.title', e.target.value);
    this.set('todosStore.' + idx + '.editing', false);
  },

  todos : function() {
    return this.get('todosStore').map((t, i) => {
      t.idx = i;
      t.classes = [];
      if (t.complete) t.classes.push('completed');
      if (t.editing) t.classes.push('editing');
      return t;
    }).filter(todo => {
      switch(this.get('props.filter')) {
        case 'active' : return todo.complete === false;
        case 'completed' : return todo.complete === true;
        default: return todo;
      }
    });
  }.property(),

  render() {
    return (
      <section className="todoapp" >
        <header className="header">
          <h1>cakejs</h1>
          <input className="new-todo" onKeyPress={ this.insertTodo } placeholder="What needs to be done?" autofocus />
        </header>
        <section className="main" onClick={ this.untoggleEditings }>
          <input className="toggle-all" type="checkbox" onChange={ this.completeAll }/>
          <label for="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              { this.get('todos').map( todo  => {
                return (
                  <li className={ todo.classes.join(' ') } onDblClick={ this.toggleEditing.bind(this, todo.idx) }>
                    <div className="view">
                      <input className="toggle" onChange={ this.completeTodo.bind(this, todo.idx) }
                        type="checkbox" checked={ todo.complete } />
                      <label>{ todo.title }</label>
                      <button className="destroy" onClick={ this.removeTodo.bind(this, todo.idx) }></button>
                    </div>
                    <input class="edit" value={ todo.title } onKeyPress={ this.editTodo.bind(this, todo.idx) }/>
                  </li>
                );
              })}
            </ul>
        </section>
        <footer className="footer">
          <span className="todo-count"><strong>{ this.get('itemsLeft') }</strong> item left</span>
          <ul className="filters">
            <li>
              <a className={ this.get('props.filter') ? '' : 'selected' } href="#/">All</a>
            </li>
            <li>
              <a className={ this.get('props.filter') === 'active' ? 'selected' : '' } href="#/active">Active</a>
            </li>
            <li>
              <a className={ this.get('props.filter') === 'completed' ? 'selected' : '' } href="#/completed">Completed</a>
            </li>
          </ul>
          <button className="clear-completed" onClick={ this.clearCompleted }>Clear completed</button>
      </footer>
      </section>
    );
  }
});
