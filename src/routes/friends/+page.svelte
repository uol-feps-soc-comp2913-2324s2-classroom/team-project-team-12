<title>Journeys</title>
<script>
  import FriendList from './friendlist.svelte';
  import UnaddedList from './unaddedlist.svelte';

  // Temporary data for friends and unadded people 
  // Real Data will be added ibced i have acess to database
  let friends = [
    { id: 1, name: 'Ayo' },
    { id: 2, name: 'Dylan' },
    { id: 3, name: 'Abbie' },
    { id: 4, name: 'Conner' },
  ];

  let unaddedPeople = [
    { id: 5, name: 'Kaitlyn' },
    { id: 6, name: 'Hari' },
  ];

  let friendFilterText = '';
  let unaddedFilterText = '';
</script>

<div class="container">
  <div class="friends-container">
    <input type="text" bind:value={friendFilterText} placeholder="Search Friends">
    <FriendList friends={friends} filterText={friendFilterText} />
  </div>

  <div class="unadded-people-container">
    <input type="text" bind:value={unaddedFilterText} placeholder="Search People">
    <UnaddedList people={unaddedPeople} filterText={unaddedFilterText} />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .friends-container,
  .unadded-people-container {
    width: 45%;
    margin: 20px;
    padding: 10px;
    border-radius: 5px;
  }
</style>
