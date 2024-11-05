<template>
    <p></p>
</template>

<script>
export default {
    created() {
        localStorage.clear();
        window.location.href = '/';
    }
}
</script>

<style>

</style>