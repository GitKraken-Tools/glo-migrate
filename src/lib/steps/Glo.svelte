<script>
    import { page } from "$app/stores";
</script>

<a
    target="_blank"
    class="btn btn-accent"
    href="/api/oauth/boards-gen?uuid={$page.params.uuid}"
>
    <i class="fab fa-gitkraken mr-2" /> Authorize Glo
</a>
