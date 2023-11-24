<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/max-attributes-per-line -->
<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>List of hashtags</h3>
      <button class="btn btn-primary" @click="addTag">Add Tag</button>
    </div>

    <form class="form-inline d-flex justify-content-center md-form form-sm">
      <input class="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search" aria-label="Search">
      <i class="fas fa-search" aria-hidden="true"></i>
    </form>

    <div v-if="displayedTags.length">
      <table class="table mt-3">
        <thead class="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col-8">Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody style="color: #fff;">
          <tr v-for="(tag, index) in displayedTags" :key="tag.id">
            <th>{{ (currentPage - 1) * tagsPerPage + index + 1 }}</th>
            <td>{{ tag.id }}</td>
            <td>{{ tag.tag_name }}</td>
            <td>
              <button class="btn btn-warning btn-sm mr-2" @click="editTag(tag.id)">Edit</button>
              <button class="btn btn-danger btn-sm" @click="deleteTag(tag.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="mt-4">No tags found.</p>
    <!-- Phân trang -->
    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': currentPage === page }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TagList',
  data() {
    return {
      tags: [],
      currentPage: 1, // trang hiện tại
      tagsPerPage: 6,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.tags.length / this.tagsPerPage);
    },
    displayedTags() {
      const start = (this.currentPage - 1) * this.tagsPerPage;
      const end = start + this.tagsPerPage;
      return this.tags.slice(start, end);
    }
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:3000/tags');
      this.tags = response.data;
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  },

  methods: {
    addTag() {
      this.$router.push('/admin/tag-list/add-tag');
    },
    editTag(id) {
      this.$router.push(`/admin/tag-list/edit-tag/${id}`);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    async deleteTag(id) {
      try {
        const confirmation = confirm('Are you sure you want to delete this tag ?');

        if (confirmation) {
          const response = await axios.delete(`http://localhost:3000/tags/${id}`);

          if (response.data.success) {
            this.tags = this.tags.filter(tag => tag.id !== id);
          }
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error deleting tag:', error);
        alert('Failed to delete tag. Please try again.');
      }
    }
  }
};
</script>
